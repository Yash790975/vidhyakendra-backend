const resultService = require("../services/studentExamResults.service");
const statusCode = require("../enums/statusCode");
const {
  createStudentExamResultValidation,
  updateStudentExamResultValidation,
} = require("../validations/studentExamResults.validations");

const createStudentExamResult = async (req, res) => {
  try {
    const { error, value } = createStudentExamResultValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const result = await resultService.createStudentExamResult(value);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: result,
      message: "Student exam result created successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to create student exam result",
    });
  }
};

const getAllStudentExamResults = async (req, res) => {
  try {
    const filters = {
      exam_schedule_id: req.query.exam_schedule_id,
      student_id: req.query.student_id,
      is_absent: req.query.is_absent,
      is_pass: req.query.is_pass,
    };

    const results = await resultService.getAllStudentExamResults(filters);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: results,
      message: "Student exam results retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve student exam results",
    });
  }
};

const getStudentExamResultById = async (req, res) => {
  try {
    const result = await resultService.getStudentExamResultById(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: result,
      message: "Student exam result retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve student exam result",
    });
  }
};

const getResultsByStudentId = async (req, res) => {
  try {
    const results = await resultService.getResultsByStudentId(req.params.student_id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: results,
      message: "Student exam results retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve student exam results",
    });
  }
};

const getResultsByExamSchedule = async (req, res) => {
  try {
    const results = await resultService.getResultsByExamSchedule(req.params.exam_schedule_id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: results,
      message: "Exam schedule results retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve exam schedule results",
    });
  }
};

const updateStudentExamResult = async (req, res) => {
  try {
    const { error, value } = updateStudentExamResultValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const result = await resultService.updateStudentExamResult(req.params.id, value);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: result,
      message: "Student exam result updated successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to update student exam result",
    });
  }
};

const deleteStudentExamResult = async (req, res) => {
  try {
    const result = await resultService.deleteStudentExamResult(req.params.id);

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
      message: err.message || "Failed to delete student exam result",
    });
  }
};

module.exports = {
  createStudentExamResult,
  getAllStudentExamResults,
  getStudentExamResultById,
  getResultsByStudentId,
  getResultsByExamSchedule,
  updateStudentExamResult,
  deleteStudentExamResult,
};
