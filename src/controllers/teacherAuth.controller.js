// src/controllers/teacherAuth.controller.js

const jwt = require('jsonwebtoken');
const teacherAuthService = require('../services/teacherAuth.service');
const {
  createAuthValidation,  
  updateAuthValidation,
  verifyLoginValidation,
  requestOTPValidation,
  verifyOTPValidation, 
  changePasswordValidation,
  resetPasswordValidation
} = require('../validations/teacherAuth.validation');
const statusCode = require('../enums/statusCode');

const createTeacherAuth = async (req, res) => {
  try {
    const { error } = createAuthValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const teacherAuth = await teacherAuthService.createTeacherAuth(req.body);

    return res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: teacherAuth,
      message: 'Teacher auth created successfully and credentials sent to email'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while creating teacher auth'
    });
  }
};

const getAllTeacherAuths = async (req, res) => {
  try {
    const teacherAuths = await teacherAuthService.getAllTeacherAuths();

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: teacherAuths,
      message: 'Teacher auths retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching teacher auths'
    });
  }
};

const getTeacherAuthById = async (req, res) => {
  try {
    const teacherAuth = await teacherAuthService.getTeacherAuthById(req.params.id);

    if (!teacherAuth) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Teacher auth not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: teacherAuth,
      message: 'Teacher auth retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching teacher auth'
    });
  }
};

const getTeacherAuthByTeacherId = async (req, res) => {
  try {
    const teacherAuth = await teacherAuthService.getTeacherAuthByTeacherId(req.params.teacherId);

    if (!teacherAuth) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Teacher auth not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: teacherAuth,
      message: 'Teacher auth retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching teacher auth'
    });
  }
};

const updateTeacherAuth = async (req, res) => {
  try {
    const { error } = updateAuthValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const teacherAuth = await teacherAuthService.updateTeacherAuth(req.params.id, req.body);

    if (!teacherAuth) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Teacher auth not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: teacherAuth,
      message: 'Teacher auth updated successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while updating teacher auth'
    });
  }
};

const deleteTeacherAuth = async (req, res) => {
  try {
    const result = await teacherAuthService.deleteTeacherAuth(req.params.id);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: result,
      message: 'Teacher auth deleted successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while deleting teacher auth'
    });
  }
};

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

    const result = await teacherAuthService.verifyLogin(
      req.body.email,
      req.body.password
    );

    // Generate JWT token
    const token = jwt.sign(
      {
        _id: result.teacherAuth._id,
        teacher_id: result.teacherAuth.teacher_id._id,
        email: result.teacherAuth.email
      },
      process.env.JWT_SECRET_TEACHER || process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: {
        ...result,
        token
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

    const result = await teacherAuthService.requestOTP(req.body.email);

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

    const result = await teacherAuthService.verifyOTP(
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

    const result = await teacherAuthService.changePassword(
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

    const result = await teacherAuthService.resetPassword(
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

module.exports = {
  createTeacherAuth,
  getAllTeacherAuths,
  getTeacherAuthById,
  getTeacherAuthByTeacherId,
  updateTeacherAuth,
  deleteTeacherAuth,
  verifyLogin,
  requestOTP,
  verifyOTP,
  changePassword,
  resetPassword
};