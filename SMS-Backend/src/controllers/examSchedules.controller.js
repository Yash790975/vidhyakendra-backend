const scheduleService = require("../services/examSchedules.service");
const statusCode = require("../enums/statusCode");
const {
  createExamScheduleValidation,
  updateExamScheduleValidation,
} = require("../validations/examSchedules.validations");

const createExamSchedule = async (req, res) => {
  try {
    const { error, value } = createExamScheduleValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const schedule = await scheduleService.createExamSchedule(value);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: schedule,
      message: "Exam schedule created successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to create exam schedule",
    });
  }
};

const getAllExamSchedules = async (req, res) => {
  try {
    const filters = {
      exam_id: req.query.exam_id,
      class_id: req.query.class_id,
      section_id: req.query.section_id,
      batch_id: req.query.batch_id,
      subject_id: req.query.subject_id,
      status: req.query.status,
    };

    const schedules = await scheduleService.getAllExamSchedules(filters);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: schedules,
      message: "Exam schedules retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve exam schedules",
    });
  }
};

const getExamScheduleById = async (req, res) => {
  try {
    const schedule = await scheduleService.getExamScheduleById(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: schedule,
      message: "Exam schedule retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve exam schedule",
    });
  }
};

const getExamSchedulesByExamId = async (req, res) => {
  try {
    const schedules = await scheduleService.getExamSchedulesByExamId(req.params.exam_id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: schedules,
      message: "Exam schedules retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve exam schedules",
    });
  }
};

const updateExamSchedule = async (req, res) => {
  try {
    const { error, value } = updateExamScheduleValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const schedule = await scheduleService.updateExamSchedule(req.params.id, value);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: schedule,
      message: "Exam schedule updated successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to update exam schedule",
    });
  }
};

const deleteExamSchedule = async (req, res) => {
  try {
    const result = await scheduleService.deleteExamSchedule(req.params.id);

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
      message: err.message || "Failed to delete exam schedule",
    });
  }
};

module.exports = {
  createExamSchedule,
  getAllExamSchedules,
  getExamScheduleById,
  getExamSchedulesByExamId,
  updateExamSchedule,
  deleteExamSchedule,
};
