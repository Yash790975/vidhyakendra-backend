const instituteDetailsService = require('../services/onboardingInstituteDetails.service');
const {
  createInstituteDetailsValidation,
  updateInstituteDetailsValidation,
  idValidation,
  getByBasicInfoIdValidation,
} = require('../validations/onboardingInstituteDetails.validation');

const createInstituteDetails = async (req, res, next) => {
  try {
    const { error, value } = createInstituteDetailsValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        isException: false,
        statusCode: 400,
        result: null,
        message: error.details.map(detail => detail.message).join(', ')
      });
    }

    const instituteDetails = await instituteDetailsService.createInstituteDetails(value);

    res.status(201).json({
      success: true,
      isException: false,
      statusCode: 201,
      result: instituteDetails,
      message: 'Institute details created successfully'
    });
  } catch (error) {
    if (error.message === 'Onboarding basic information not found') {
      return res.status(404).json({
        success: false,
        isException: false,
        statusCode: 404,
        result: null,
        message: error.message
      });
    }
    if (error.message === 'Institute details already exist for this onboarding record') {
      return res.status(409).json({
        success: false,
        isException: false,
        statusCode: 409,
        result: null,
        message: error.message
      });
    }
    next(error);
  }
};

const getAllInstituteDetails = async (req, res, next) => {
  try {
    const { is_active, school_board, school_type, medium, approx_students_range } = req.query;

    const filters = {};
    if (is_active !== undefined) {
      filters.is_active = is_active === 'true';
    }
    if (school_board) {
      filters.school_board = school_board;
    }
    if (school_type) {
      filters.school_type = school_type;
    }
    if (medium) {
      filters.medium = medium;
    }
    if (approx_students_range) {
      filters.approx_students_range = approx_students_range;
    }

    const instituteDetails = await instituteDetailsService.getAllInstituteDetails(filters);

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: instituteDetails,
      message: 'Institute details retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getInstituteDetailsById = async (req, res, next) => {
  try {
    const { error } = idValidation.validate({ id: req.params.id });

    if (error) {
      return res.status(400).json({
        success: false,
        isException: false,
        statusCode: 400,
        result: null,
        message: error.details.map(detail => detail.message).join(', ')
      });
    }

    const instituteDetails = await instituteDetailsService.getInstituteDetailsById(req.params.id);

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: instituteDetails,
      message: 'Institute details retrieved successfully'
    });
  } catch (error) {
    if (error.message === 'Institute details not found') {
      return res.status(404).json({
        success: false,
        isException: false,
        statusCode: 404,
        result: null,
        message: error.message
      });
    }
    next(error);
  }
};

const getInstituteDetailsByBasicInfoId = async (req, res, next) => {
  try {
    const { error } = getByBasicInfoIdValidation.validate({ 
      onboarding_basic_info_id: req.params.onboarding_basic_info_id 
    });

    if (error) {
      return res.status(400).json({
        success: false,
        isException: false,
        statusCode: 400,
        result: null,
        message: error.details.map(detail => detail.message).join(', ')
      });
    }

    const instituteDetails = await instituteDetailsService.getInstituteDetailsByBasicInfoId(
      req.params.onboarding_basic_info_id
    );

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: instituteDetails,
      message: 'Institute details retrieved successfully'
    });
  } catch (error) {
    if (error.message === 'Institute details not found') {
      return res.status(404).json({
        success: false,
        isException: false,
        statusCode: 404,
        result: null,
        message: error.message
      });
    }
    next(error);
  }
};

const updateInstituteDetails = async (req, res, next) => {
  try {
    const { error: idError } = idValidation.validate({ id: req.params.id });

    if (idError) {
      return res.status(400).json({
        success: false,
        isException: false,
        statusCode: 400,
        result: null,
        message: idError.details.map(detail => detail.message).join(', ')
      });
    }

    const { error, value } = updateInstituteDetailsValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        isException: false,
        statusCode: 400,
        result: null,
        message: error.details.map(detail => detail.message).join(', ')
      });
    }

    const instituteDetails = await instituteDetailsService.updateInstituteDetails(
      req.params.id, 
      value
    );

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: instituteDetails,
      message: 'Institute details updated successfully'
    });
  } catch (error) {
    if (error.message === 'Institute details not found' || 
        error.message === 'Onboarding basic information not found') {
      return res.status(404).json({
        success: false,
        isException: false,
        statusCode: 404,
        result: null,
        message: error.message
      });
    }
    if (error.message === 'Institute details already exist for this onboarding record') {
      return res.status(409).json({
        success: false,
        isException: false,
        statusCode: 409,
        result: null,
        message: error.message
      });
    }
    next(error);
  }
};

const deleteInstituteDetails = async (req, res, next) => {
  try {
    const { error } = idValidation.validate({ id: req.params.id });

    if (error) {
      return res.status(400).json({
        success: false,
        isException: false,
        statusCode: 400,
        result: null,
        message: error.details.map(detail => detail.message).join(', ')
      });
    }

    await instituteDetailsService.deleteInstituteDetails(req.params.id);

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: null,
      message: 'Institute details deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Institute details not found') {
      return res.status(404).json({
        success: false,
        isException: false,
        statusCode: 404,
        result: null,
        message: error.message
      });
    }
    next(error);
  }
};

const getInstituteDetailsBySchoolBoard = async (req, res, next) => {
  try {
    const { school_board } = req.params;

    const validBoards = ['CBSE', 'ICSE', 'State Board', 'Other'];
    if (!validBoards.includes(school_board)) {
      return res.status(400).json({
        success: false,
        isException: false,
        statusCode: 400,
        result: null,
        message: 'Invalid school board. Must be one of: CBSE, ICSE, State Board, Other'
      });
    }

    const instituteDetails = await instituteDetailsService.getInstituteDetailsBySchoolBoard(
      school_board
    );

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: instituteDetails,
      message: `Institute details for ${school_board} retrieved successfully`
    });
  } catch (error) {
    next(error);
  }
};

const getInstituteDetailsBySchoolType = async (req, res, next) => {
  try {
    const { school_type } = req.params;

    const validTypes = ['private', 'government', 'public'];
    if (!validTypes.includes(school_type)) {
      return res.status(400).json({
        success: false,
        isException: false,
        statusCode: 400,
        result: null,
        message: 'Invalid school type. Must be one of: private, government, public'
      });
    }

    const instituteDetails = await instituteDetailsService.getInstituteDetailsBySchoolType(
      school_type
    );

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: instituteDetails,
      message: `Institute details for ${school_type} schools retrieved successfully`
    });
  } catch (error) {
    next(error);
  }
};

const getInstituteDetailsByMedium = async (req, res, next) => {
  try {
    const { medium } = req.params;

    const validMediums = ['english', 'hindi', 'other'];
    if (!validMediums.includes(medium)) {
      return res.status(400).json({
        success: false,
        isException: false,
        statusCode: 400,
        result: null,
        message: 'Invalid medium. Must be one of: english, hindi, other'
      });
    }

    const instituteDetails = await instituteDetailsService.getInstituteDetailsByMedium(medium);

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: instituteDetails,
      message: `Institute details for ${medium} medium retrieved successfully`
    });
  } catch (error) {
    next(error);
  }
};

const getInstituteDetailsByStudentsRange = async (req, res, next) => {
  try {
    const { students_range } = req.params;

    const validRanges = ['1-100', '101-250', '251-500', '500-1000', '1000+'];
    if (!validRanges.includes(students_range)) {
      return res.status(400).json({
        success: false,
        isException: false,
        statusCode: 400,
        result: null,
        message: 'Invalid students range. Must be one of: 1-100, 101-250, 251-500, 500-1000, 1000+'
      });
    }

    const instituteDetails = await instituteDetailsService.getInstituteDetailsByStudentsRange(
      students_range
    );

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: instituteDetails,
      message: `Institute details for ${students_range} students retrieved successfully`
    });
  } catch (error) {
    next(error);
  }
};

const getCompleteOnboardingData = async (req, res, next) => {
  try {
    const { error } = getByBasicInfoIdValidation.validate({ 
      onboarding_basic_info_id: req.params.onboarding_basic_info_id 
    });

    if (error) {
      return res.status(400).json({
        success: false,
        isException: false,
        statusCode: 400,
        result: null,
        message: error.details.map(detail => detail.message).join(', ')
      });
    }

    const completeData = await instituteDetailsService.getCompleteOnboardingData(
      req.params.onboarding_basic_info_id
    );

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: completeData,
      message: 'Complete onboarding data retrieved successfully'
    });
  } catch (error) {
    if (error.message === 'Onboarding basic information not found') {
      return res.status(404).json({
        success: false,
        isException: false,
        statusCode: 404,
        result: null,
        message: error.message
      });
    }
    next(error);
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