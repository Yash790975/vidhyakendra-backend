const onboardingService = require('../services/onboardingBasicInformation.service');
const otpService = require('../services/otp.service');
const {
  createOnboardingValidation,
  updateOnboardingValidation,
  sendOTPValidation,
  verifyOTPValidation,
  idValidation,
} = require('../validations/onboardingBasicInformation.validation');

const createOnboarding = async (req, res, next) => {
  try {
    const { error, value } = createOnboardingValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        isException: false,
        statusCode: 400,
        result: null,
        message: error.details.map(detail => detail.message).join(', ')
      });
    }

    const onboarding = await onboardingService.createOnboarding(value);

    // Automatically send OTP after successful registration
    try {
      await otpService.createAndSendOTP(value.mobile, value.email, 'mobile_verification');
    } catch (otpError) {
      console.error('Error sending OTP:', otpError);
      // Don't fail the registration if OTP sending fails
    }

    res.status(201).json({
      success: true,
      isException: false,
      statusCode: 201,
      result: onboarding,
      message: 'Onboarding record created successfully. OTP sent to your email.'
    });
  } catch (error) {
    if (error.message === 'Email already exists' || error.message === 'Mobile number already exists') {
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

const getAllOnboardings = async (req, res, next) => {
  try {
    const { is_active, institute_type, mobile_number_verified } = req.query;

    const filters = {};
    if (is_active !== undefined) {
      filters.is_active = is_active === 'true';
    }
    if (institute_type) {
      filters.institute_type = institute_type;
    }
    if (mobile_number_verified !== undefined) {
      filters.mobile_number_verified = mobile_number_verified === 'true';
    }

    const onboardings = await onboardingService.getAllOnboardings(filters);

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: onboardings,
      message: 'Onboarding records retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getOnboardingById = async (req, res, next) => {
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

    const onboarding = await onboardingService.getOnboardingById(req.params.id);

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: onboarding,
      message: 'Onboarding record retrieved successfully'
    });
  } catch (error) {
    if (error.message === 'Onboarding record not found') {
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

const updateOnboarding = async (req, res, next) => {
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

    const { error, value } = updateOnboardingValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        isException: false,
        statusCode: 400,
        result: null,
        message: error.details.map(detail => detail.message).join(', ')
      });
    }

    const onboarding = await onboardingService.updateOnboarding(req.params.id, value);

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: onboarding,
      message: 'Onboarding record updated successfully'
    });
  } catch (error) {
    if (error.message === 'Onboarding record not found') {
      return res.status(404).json({
        success: false,
        isException: false,
        statusCode: 404,
        result: null,
        message: error.message
      });
    }
    if (error.message === 'Email already exists' || error.message === 'Mobile number already exists') {
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

const deleteOnboarding = async (req, res, next) => {
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

    await onboardingService.deleteOnboarding(req.params.id);

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: null,
      message: 'Onboarding record deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Onboarding record not found') {
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

const sendOTP = async (req, res, next) => {
  try {
    const { error, value } = sendOTPValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        isException: false,
        statusCode: 400,
        result: null,
        message: error.details.map(detail => detail.message).join(', ')
      });
    }

    const result = await otpService.createAndSendOTP(value.mobile, value.email, 'mobile_verification');

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: { otp_id: result.otp_id },
      message: 'OTP sent successfully to your email'
    });
  } catch (error) {
    next(error);
  }
};

const resendOTP = async (req, res, next) => {
  try {
    const { error, value } = sendOTPValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        isException: false,
        statusCode: 400,
        result: null,
        message: error.details.map(detail => detail.message).join(', ')
      });
    }

    const result = await otpService.resendOTP(value.mobile, value.email, 'mobile_verification');

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: { otp_id: result.otp_id },
      message: 'OTP resent successfully to your email'
    });
  } catch (error) {
    if (error.message === 'Please wait for 1 minute before requesting a new OTP') {
      return res.status(429).json({
        success: false,
        isException: false,
        statusCode: 429,
        result: null,
        message: error.message
      });
    }
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { error, value } = verifyOTPValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        isException: false,
        statusCode: 400,
        result: null,
        message: error.details.map(detail => detail.message).join(', ')
      });
    }

    // Verify OTP
    await otpService.verifyOTP(value.mobile, value.otp);

    // Update onboarding record
    const onboarding = await onboardingService.verifyMobileNumber(value.mobile);

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: onboarding,
      message: 'Mobile number verified successfully. Welcome email sent.'
    });
  } catch (error) {
    if (error.message === 'Invalid OTP' || error.message === 'OTP has expired') {
      return res.status(400).json({
        success: false,
        isException: false,
        statusCode: 400,
        result: null,
        message: error.message
      });
    }
    if (error.message === 'Onboarding record not found') {
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

const getVerifiedOnboardings = async (req, res, next) => {
  try {
    const onboardings = await onboardingService.getVerifiedOnboardings();

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: onboardings,
      message: 'Verified onboarding records retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getUnverifiedOnboardings = async (req, res, next) => {
  try {
    const onboardings = await onboardingService.getUnverifiedOnboardings();

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: onboardings,
      message: 'Unverified onboarding records retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOnboarding,
  getAllOnboardings,
  getOnboardingById,
  updateOnboarding,
  deleteOnboarding,
  sendOTP,
  resendOTP,
  verifyOTP,
  getVerifiedOnboardings,
  getUnverifiedOnboardings,
};