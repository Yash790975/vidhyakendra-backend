const OnboardingInstituteDetails = require('../models/onboardingInstituteDetails.model');
const OnboardingBasicInformation = require('../models/onboardingBasicInformation.model');

const createInstituteDetails = async (data) => {
  try {         
    // Check if basic info exists
    const basicInfo = await OnboardingBasicInformation.findById(data.onboarding_basic_info_id);
    if (!basicInfo) {
      throw new Error('Onboarding basic information not found');
    }

    // Check if institute details already exist for this basic info
    const existingDetails = await OnboardingInstituteDetails.findOne({
      onboarding_basic_info_id: data.onboarding_basic_info_id,
    });
    if (existingDetails) {
      throw new Error('Institute details already exist for this onboarding record');
    }

    const instituteDetails = new OnboardingInstituteDetails(data);
    await instituteDetails.save();

    // Populate basic info
    await instituteDetails.populate('onboarding_basic_info_id');

    return instituteDetails;
  } catch (error) {
    throw error;
  }
};

const getAllInstituteDetails = async (filters = {}) => {
  try {
    const query = {};

    if (filters.is_active !== undefined) {
      query.is_active = filters.is_active;
    }

    if (filters.school_board) {
      query.school_board = filters.school_board;
    }

    if (filters.school_type) {
      query.school_type = filters.school_type;
    }

    if (filters.medium) {
      query.medium = filters.medium;
    }

    if (filters.approx_students_range) {
      query.approx_students_range = filters.approx_students_range;
    }

    const instituteDetails = await OnboardingInstituteDetails.find(query)
      .populate('onboarding_basic_info_id')
      .sort({ createdAt: -1 });

    return instituteDetails;
  } catch (error) {
    throw error;
  }
};

const getInstituteDetailsById = async (id) => {
  try {
    const instituteDetails = await OnboardingInstituteDetails.findById(id)
      .populate('onboarding_basic_info_id');

    if (!instituteDetails) {
      throw new Error('Institute details not found');
    }

    return instituteDetails;
  } catch (error) {
    throw error;
  }
};

const getInstituteDetailsByBasicInfoId = async (basicInfoId) => {
  try {
    const instituteDetails = await OnboardingInstituteDetails.findOne({
      onboarding_basic_info_id: basicInfoId,
    }).populate('onboarding_basic_info_id');

    if (!instituteDetails) {
      throw new Error('Institute details not found');
    }

    return instituteDetails;
  } catch (error) {
    throw error;
  }
};

const updateInstituteDetails = async (id, data) => {
  try {
    // If basic info ID is being updated, check if it exists
    if (data.onboarding_basic_info_id) {
      const basicInfo = await OnboardingBasicInformation.findById(data.onboarding_basic_info_id);
      if (!basicInfo) {
        throw new Error('Onboarding basic information not found');
      }

      // Check if institute details already exist for the new basic info
      const existingDetails = await OnboardingInstituteDetails.findOne({
        onboarding_basic_info_id: data.onboarding_basic_info_id,
        _id: { $ne: id },
      });
      if (existingDetails) {
        throw new Error('Institute details already exist for this onboarding record');
      }
    }

    const instituteDetails = await OnboardingInstituteDetails.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    ).populate('onboarding_basic_info_id');

    if (!instituteDetails) {
      throw new Error('Institute details not found');
    }

    return instituteDetails;
  } catch (error) {
    throw error;
  }
};

const deleteInstituteDetails = async (id) => {
  try {
    const instituteDetails = await OnboardingInstituteDetails.findByIdAndDelete(id);

    if (!instituteDetails) {
      throw new Error('Institute details not found');
    }

    return instituteDetails;
  } catch (error) {
    throw error;
  }
};

const getInstituteDetailsBySchoolBoard = async (schoolBoard) => {
  try {
    const instituteDetails = await OnboardingInstituteDetails.find({
      school_board: schoolBoard,
      is_active: true,
    })
      .populate('onboarding_basic_info_id')
      .sort({ createdAt: -1 });

    return instituteDetails;
  } catch (error) {
    throw error;
  }
};

const getInstituteDetailsBySchoolType = async (schoolType) => {
  try {
    const instituteDetails = await OnboardingInstituteDetails.find({
      school_type: schoolType,
      is_active: true,
    })
      .populate('onboarding_basic_info_id')
      .sort({ createdAt: -1 });

    return instituteDetails;
  } catch (error) {
    throw error;
  }
};

const getInstituteDetailsByMedium = async (medium) => {
  try {
    const instituteDetails = await OnboardingInstituteDetails.find({
      medium: medium,
      is_active: true,
    })
      .populate('onboarding_basic_info_id')
      .sort({ createdAt: -1 });

    return instituteDetails;
  } catch (error) {
    throw error;
  }
};

const getInstituteDetailsByStudentsRange = async (studentsRange) => {
  try {
    const instituteDetails = await OnboardingInstituteDetails.find({
      approx_students_range: studentsRange,
      is_active: true,
    })
      .populate('onboarding_basic_info_id')
      .sort({ createdAt: -1 });

    return instituteDetails;
  } catch (error) {
    throw error;
  }
};

const getCompleteOnboardingData = async (basicInfoId) => {
  try {
    // Get basic information
    const basicInfo = await OnboardingBasicInformation.findById(basicInfoId);
    if (!basicInfo) {
      throw new Error('Onboarding basic information not found');
    }

    // Get institute details
    const instituteDetails = await OnboardingInstituteDetails.findOne({
      onboarding_basic_info_id: basicInfoId,
    });

    return {
      basic_information: basicInfo,
      institute_details: instituteDetails || null,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createInstituteDetails,
  getAllInstituteDetails,
  getInstituteDetailsById,
  getInstituteDetailsByBasicInfoId,
  updateInstituteDetails,
  deleteInstituteDetails,
  getInstituteDetailsBySchoolBoard,
  getInstituteDetailsBySchoolType,
  getInstituteDetailsByMedium,
  getInstituteDetailsByStudentsRange,
  getCompleteOnboardingData,
};