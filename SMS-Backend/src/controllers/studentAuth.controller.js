const studentAuthService = require("../services/studentAuth.service");
const statusCode = require("../enums/statusCode");
const {
  createStudentAuthValidation,
  loginValidation,
  changePasswordValidation,
  resetPasswordValidation,
  updateStatusValidation,
} = require("../validations/studentAuth.validations");

// ============= STUDENT AUTHENTICATION =============

const createStudentAuth = async (req, res) => {
  try {
    const { error, value } = createStudentAuthValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const auth = await studentAuthService.createStudentAuth(value);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: auth,
      message: auth.message || "Student authentication created successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to create student authentication",
    });
  }
};

const login = async (req, res) => {
  try {
    const { error, value } = loginValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const result = await studentAuthService.login(
      value.username,
      value.password
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: result,
      message: result.message,
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Login failed",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { error, value } = changePasswordValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const result = await studentAuthService.changePassword(
      req.params.student_id,
      value.old_password,
      value.new_password
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: {},
      message: result.message,
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to change password",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { error, value } = resetPasswordValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const result = await studentAuthService.resetPassword(
      value.student_id,
      value.new_password
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: { temporary_password: result.temporary_password },
      message: result.message,
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to reset password",
    });
  }
};

const getAuthByStudentId = async (req, res) => {
  try {
    const auth = await studentAuthService.getAuthByStudentId(
      req.params.student_id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: auth,
      message: "Authentication retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve authentication",
    });
  }
};

const getAllStudentAuths = async (req, res) => {
  try {
    const filters = {
      student_id: req.query.student_id,
      username: req.query.username,
      status: req.query.status,
      is_first_login: req.query.is_first_login,
    };

    const auths = await studentAuthService.getAllStudentAuths(filters);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: auths,
      message: "Student authentications retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve student authentications",
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { error, value } = updateStatusValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const result = await studentAuthService.updateStatus(
      req.params.student_id,
      value.status
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: { status: result.status },
      message: result.message,
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to update status",
    });
  }
};

const deleteAuth = async (req, res) => {
  try {
    const result = await studentAuthService.deleteAuth(req.params.student_id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: {},
      message: result.message,
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to delete authentication",
    });
  }
};

module.exports = {
  createStudentAuth,
  login,
  changePassword,
  resetPassword,
  getAuthByStudentId,
  getAllStudentAuths,
  updateStatus,
  deleteAuth,
};