const jwt = require('jsonwebtoken');
const instituteAdminService = require('../services/instituteAdmin.service');
const { 
  createAdminValidation,  
  updateAdminValidation,
  verifyLoginValidation,
  requestOTPValidation,
  verifyOTPValidation,
  changePasswordValidation,
  resetPasswordValidation
} = require('../validations/instituteAdmin.validation');
const statusCode = require('../enums/statusCode');

const createAdmin = async (req, res) => {
  try {
    const { error } = createAdminValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const admin = await instituteAdminService.createAdmin(req.body);

    return res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: admin,
      message: 'Admin created successfully and credentials sent to email'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while creating admin'
    });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const admins = await instituteAdminService.getAllAdmins();

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: admins,
      message: 'Admins retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching admins'
    });
  }
};

const getAdminById = async (req, res) => {
  try {
    const admin = await instituteAdminService.getAdminById(req.params.id);

    if (!admin) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Admin not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: admin,
      message: 'Admin retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching admin'
    });
  }
};

const getAdminByInstituteId = async (req, res) => {
  try {
    const admin = await instituteAdminService.getAdminByInstituteId(req.params.instituteId);

    if (!admin) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Admin not found'
      });
    }
    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: admin,
      message: 'Admin retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching admin'
    });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { error } = updateAdminValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const admin = await instituteAdminService.updateAdmin(req.params.id, req.body);

    if (!admin) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Admin not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: admin,
      message: 'Admin updated successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while updating admin'
    });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const result = await instituteAdminService.deleteAdmin(req.params.id);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: result,
      message: 'Admin deleted successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while deleting admin'
    });
  }
};



// Update the verifyLogin function
const verifyLogin = async (req, res) => {
  try {
    const { error } = verifyLoginValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const result = await instituteAdminService.verifyLogin(
      req.body.email,
      req.body.password
    );

    // Generate JWT token
    const token = jwt.sign(
      {
        _id: result.admin._id, 
        email: result.admin.email,
        name: result.admin.name,
        institute_id: result.admin.institute_id._id
      },
      process.env.JWT_SECRET_INSTITUTE_ADMIN || process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: {
        ...result,
        token  // Add token to response
      },
      message: 'Login successful'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong during login'
    });
  }
};

const requestOTP = async (req, res) => {
  try {
    const { error } = requestOTPValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const result = await instituteAdminService.requestOTP(req.body.email);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: result,
      message: 'OTP sent successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while sending OTP'
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { error } = verifyOTPValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const result = await instituteAdminService.verifyOTP(
      req.body.email,
      req.body.otp
    );

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: result,
      message: 'OTP verified successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while verifying OTP'
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { error } = changePasswordValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const result = await instituteAdminService.changePassword(
      req.body.email,
      req.body.old_password,
      req.body.new_password
    );

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: result,
      message: 'Password changed successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while changing password'
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { error } = resetPasswordValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const result = await instituteAdminService.resetPassword(
      req.body.email,
      req.body.otp,
      req.body.new_password
    );

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: result,
      message: 'Password reset successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while resetting password'
    });
  }
};

const getAdminsByInstituteType = async (req, res) => {
  try {
    const { type } = req.params;

    if (!['school', 'coaching'].includes(type)) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: 'Invalid institute type. Must be "school" or "coaching"'
      });
    }

    const admins = await instituteAdminService.getAdminsByInstituteType(type);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK, 
      result: admins,
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} admins retrieved successfully`
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching admins'
    });
  }
};

module.exports = {       
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  verifyLogin,
  requestOTP,
  verifyOTP, 
  changePassword,
  resetPassword,
  getAdminsByInstituteType,
  getAdminByInstituteId
};