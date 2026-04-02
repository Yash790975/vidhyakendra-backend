const jwt = require('jsonwebtoken');
const studentAuthService = require('../services/studentAuth.service');
const {
  createAuthValidation,  
  updateAuthValidation,    
  verifyLoginValidation,
  requestOTPValidation,
  verifyOTPValidation, 
  changePasswordValidation,
  resetPasswordValidation
} = require('../validations/studentAuth.validations');
const statusCode = require('../enums/statusCode');

const createStudentAuth = async (req, res) => {
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

    const studentAuth = await studentAuthService.createStudentAuth(req.body);

    return res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: studentAuth,
      message: 'Student auth created successfully and credentials sent to registered email'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while creating student auth'
    });
  }
};

const getAllStudentAuths = async (req, res) => {
  try {
    const studentAuths = await studentAuthService.getAllStudentAuths();

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: studentAuths,
      message: 'Student auths retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching student auths'
    });
  }
};

const getStudentAuthById = async (req, res) => {
  try {
    const studentAuth = await studentAuthService.getStudentAuthById(req.params.id);

    if (!studentAuth) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Student auth not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: studentAuth,
      message: 'Student auth retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching student auth'
    });
  }
};

const getStudentAuthByStudentId = async (req, res) => {
  try {
    const studentAuth = await studentAuthService.getStudentAuthByStudentId(req.params.studentId);

    if (!studentAuth) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Student auth not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: studentAuth,
      message: 'Student auth retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching student auth'
    });
  }
};

const getStudentAuthByUsername = async (req, res) => {
  try {
    const studentAuth = await studentAuthService.getStudentAuthByUsername(req.params.username);

    if (!studentAuth) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Student auth not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: studentAuth,
      message: 'Student auth retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching student auth'
    });
  }
};

const updateStudentAuth = async (req, res) => {
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

    const studentAuth = await studentAuthService.updateStudentAuth(req.params.id, req.body);

    if (!studentAuth) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Student auth not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: studentAuth,
      message: 'Student auth updated successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while updating student auth'
    });
  }
};

const deleteStudentAuth = async (req, res) => {
  try {
    const result = await studentAuthService.deleteStudentAuth(req.params.id);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: result,
      message: 'Student auth deleted successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while deleting student auth'
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

    const result = await studentAuthService.verifyLogin(
      req.body.username,
      req.body.password
    );

    // Generate JWT token
    const token = jwt.sign(
      {
        _id: result.studentAuth._id,
        student_id: result.studentAuth.student_id._id,
        username: result.studentAuth.username
      },
      process.env.JWT_SECRET_STUDENT || process.env.JWT_SECRET,
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

    const result = await studentAuthService.requestOTP(req.body.username);

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

    const result = await studentAuthService.verifyOTP(
      req.body.username,
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

    const result = await studentAuthService.changePassword(
      req.body.username,
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

    const result = await studentAuthService.resetPassword(
      req.body.username,
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
  createStudentAuth,
  getAllStudentAuths,
  getStudentAuthById,
  getStudentAuthByStudentId,
  getStudentAuthByUsername,
  updateStudentAuth,
  deleteStudentAuth,
  verifyLogin,
  requestOTP,
  verifyOTP,
  changePassword,
  resetPassword
};













































































// const studentAuthService = require("../services/studentAuth.service");
// const statusCode = require("../enums/statusCode");
// const {
//   createStudentAuthValidation,
//   loginValidation, 
//   changePasswordValidation,
//   resetPasswordValidation,
//   updateStatusValidation,
// } = require("../validations/studentAuth.validations");

// // ============= STUDENT AUTHENTICATION =============

// const createStudentAuth = async (req, res) => {
//   try {
//     const { error, value } = createStudentAuthValidation.validate(req.body);
//     if (error) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: {},
//         message: error.details[0].message,
//       });
//     }

//     const auth = await studentAuthService.createStudentAuth(value);

//     res.status(statusCode.CREATED).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.CREATED,
//       result: auth,
//       message: auth.message || "Student authentication created successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to create student authentication",
//     });
//   }
// };

// const login = async (req, res) => {
//   try {
//     const { error, value } = loginValidation.validate(req.body);
//     if (error) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: {},
//         message: error.details[0].message,
//       });
//     }

//     const result = await studentAuthService.login(
//       value.username,
//       value.password
//     );

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: result,
//       message: result.message,
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Login failed",
//     });
//   }
// };

// const changePassword = async (req, res) => {
//   try {
//     const { error, value } = changePasswordValidation.validate(req.body);
//     if (error) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: {},
//         message: error.details[0].message,
//       });
//     }

//     const result = await studentAuthService.changePassword(
//       req.params.student_id,
//       value.old_password,
//       value.new_password
//     );

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: {},
//       message: result.message,
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to change password",
//     });
//   }
// };

// const resetPassword = async (req, res) => {
//   try {
//     const { error, value } = resetPasswordValidation.validate(req.body);
//     if (error) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: {},
//         message: error.details[0].message,
//       });
//     }

//     const result = await studentAuthService.resetPassword(
//       value.student_id,
//       value.new_password
//     );

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: { temporary_password: result.temporary_password },
//       message: result.message,
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to reset password",
//     });
//   }
// };

// const getAuthByStudentId = async (req, res) => {
//   try {
//     const auth = await studentAuthService.getAuthByStudentId(
//       req.params.student_id
//     );

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: auth,
//       message: "Authentication retrieved successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to retrieve authentication",
//     });
//   }
// };

// const getAllStudentAuths = async (req, res) => {
//   try {
//     const filters = {
//       student_id: req.query.student_id,
//       username: req.query.username,
//       status: req.query.status,
//       is_first_login: req.query.is_first_login,
//     };

//     const auths = await studentAuthService.getAllStudentAuths(filters);

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: auths,
//       message: "Student authentications retrieved successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to retrieve student authentications",
//     });
//   }
// };

// const updateStatus = async (req, res) => {
//   try {
//     const { error, value } = updateStatusValidation.validate(req.body);
//     if (error) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: {},
//         message: error.details[0].message,
//       });
//     }

//     const result = await studentAuthService.updateStatus(
//       req.params.student_id,
//       value.status
//     );

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: { status: result.status },
//       message: result.message,
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to update status",
//     });
//   }
// };

// const deleteAuth = async (req, res) => {
//   try {
//     const result = await studentAuthService.deleteAuth(req.params.student_id);

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: {},
//       message: result.message,
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to delete authentication",
//     });
//   }
// };

// module.exports = {
//   createStudentAuth,
//   login,
//   changePassword,
//   resetPassword,
//   getAuthByStudentId,
//   getAllStudentAuths,
//   updateStatus,
//   deleteAuth,
// };