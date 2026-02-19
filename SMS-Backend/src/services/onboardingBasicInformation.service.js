const OnboardingBasicInformation = require('../models/onboardingBasicInformation.model');
const { sendWelcomeEmail } = require('./email.service');

const createOnboarding = async (data) => {
  try {
    // Check if email already exists
    const existingEmail = await OnboardingBasicInformation.findOne({ email: data.email });
    if (existingEmail) {
      throw new Error('Email already exists'); 
    }

    // Check if mobile already exists
    const existingMobile = await OnboardingBasicInformation.findOne({ mobile: data.mobile });
    if (existingMobile) {
      throw new Error('Mobile number already exists');
    }

    const onboarding = new OnboardingBasicInformation(data);
    await onboarding.save();

    return onboarding;
  } catch (error) {
    throw error;
  }
};

const getAllOnboardings = async (filters = {}) => {
  try {
    const query = {};

    if (filters.is_active !== undefined) {
      query.is_active = filters.is_active;
    }

    if (filters.institute_type) {
      query.institute_type = filters.institute_type;
    }

    if (filters.mobile_number_verified !== undefined) {
      query.mobile_number_verified = filters.mobile_number_verified;
    }

    const onboardings = await OnboardingBasicInformation.find(query).sort({ createdAt: -1 });
    return onboardings;
  } catch (error) {
    throw error;
  }
};

const getOnboardingById = async (id) => {
  try {
    const onboarding = await OnboardingBasicInformation.findById(id);

    if (!onboarding) {
      throw new Error('Onboarding record not found');
    }

    return onboarding;
  } catch (error) {
    throw error;
  }
};

const getOnboardingByMobile = async (mobile) => {
  try {
    const onboarding = await OnboardingBasicInformation.findOne({ mobile });

    if (!onboarding) {
      throw new Error('Onboarding record not found');
    }

    return onboarding;
  } catch (error) {
    throw error;
  }
};

const getOnboardingByEmail = async (email) => {
  try {
    const onboarding = await OnboardingBasicInformation.findOne({ email });

    if (!onboarding) {
      throw new Error('Onboarding record not found');
    }

    return onboarding;
  } catch (error) {
    throw error;
  }
};

const updateOnboarding = async (id, data) => {
  try {
    // If email is being updated, check if it already exists
    if (data.email) {
      const existingEmail = await OnboardingBasicInformation.findOne({
        email: data.email,
        _id: { $ne: id },
      });
      if (existingEmail) {
        throw new Error('Email already exists');
      }
    }

    // If mobile is being updated, check if it already exists
    if (data.mobile) {
      const existingMobile = await OnboardingBasicInformation.findOne({
        mobile: data.mobile,
        _id: { $ne: id },
      });
      if (existingMobile) {
        throw new Error('Mobile number already exists');
      }
    }

    const onboarding = await OnboardingBasicInformation.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!onboarding) {
      throw new Error('Onboarding record not found');
    }

    return onboarding;
  } catch (error) {
    throw error;
  }
};

const deleteOnboarding = async (id) => {
  try {
    const onboarding = await OnboardingBasicInformation.findByIdAndDelete(id);

    if (!onboarding) {
      throw new Error('Onboarding record not found');
    }

    return onboarding;
  } catch (error) {
    throw error;
  }
};

const verifyMobileNumber = async (mobile) => {
  try {
    const onboarding = await OnboardingBasicInformation.findOneAndUpdate(
      { mobile },
      { mobile_number_verified: true },
      { new: true }
    );

    if (!onboarding) {
      throw new Error('Onboarding record not found');
    }

    // Send welcome email
    await sendWelcomeEmail(onboarding.email, onboarding.institute_name, onboarding.owner_name);

    return onboarding;
  } catch (error) {
    throw error;
  }
};

const getVerifiedOnboardings = async () => {
  try {
    const onboardings = await OnboardingBasicInformation.find({
      mobile_number_verified: true,
      is_active: true,
    }).sort({ createdAt: -1 });

    return onboardings;
  } catch (error) {
    throw error;
  }
};

const getUnverifiedOnboardings = async () => {
  try {
    const onboardings = await OnboardingBasicInformation.find({
      mobile_number_verified: false,
    }).sort({ createdAt: -1 });

    return onboardings;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createOnboarding,
  getAllOnboardings,
  getOnboardingById,
  getOnboardingByMobile,
  getOnboardingByEmail,
  updateOnboarding,
  deleteOnboarding,
  verifyMobileNumber,
  getVerifiedOnboardings,
  getUnverifiedOnboardings,
};