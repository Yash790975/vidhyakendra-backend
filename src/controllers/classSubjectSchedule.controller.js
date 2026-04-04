const scheduleService = require("../services/classSubjectSchedule.service");
const statusCode = require("../enums/statusCode");
const {
  createScheduleValidation,
  updateScheduleValidation,
} = require("../validations/classSubjectSchedule.validations");

const createSchedule = async (req, res) => {
  try {
    const { error, value } = createScheduleValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const schedule = await scheduleService.createSchedule(value);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: schedule,
      message: "Schedule created successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to create schedule",
    });
  }
};

const getAllSchedules = async (req, res) => {
  try {
    const filters = {
      class_id:      req.query.class_id,
      section_id:    req.query.section_id,
      batch_id:      req.query.batch_id,        //  NEW
      subject_id:    req.query.subject_id,
      teacher_id:    req.query.teacher_id,
      day_of_week:   req.query.day_of_week,
      academic_year: req.query.academic_year,
      status:        req.query.status,
    };

    const schedules = await scheduleService.getAllSchedules(filters);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: schedules,
      message: "Schedules retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve schedules",
    });
  }
};

const getScheduleById = async (req, res) => {
  try {
    const schedule = await scheduleService.getScheduleById(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: schedule,
      message: "Schedule retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve schedule",
    });
  }
};

const getScheduleByClassId = async (req, res) => {
  try {
    const { class_id } = req.params;
    const { section_id, batch_id, academic_year, status } = req.query; //  batch_id added

    const schedules = await scheduleService.getScheduleByClassId(class_id, {
      section_id,
      batch_id,        //  NEW
      academic_year,
      status,
    });

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: schedules,
      message: "Schedules retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve schedules",
    });
  }
};

const getScheduleByTeacherId = async (req, res) => {
  try {
    const { teacher_id } = req.params;
    const { academic_year, status } = req.query;

    const schedules = await scheduleService.getScheduleByTeacherId(
      teacher_id,
      { academic_year, status }
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: schedules,
      message: "Teacher schedule retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve teacher schedule",
    });
  }
};

//  NEW
const getScheduleByBatchId = async (req, res) => {
  try {
    const { batch_id } = req.params;
    const { academic_year, status, day_of_week } = req.query;

    const schedules = await scheduleService.getScheduleByBatchId(batch_id, {
      academic_year,
      status,
      day_of_week,
    });

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: schedules,
      message: "Batch schedule retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve batch schedule",
    });
  }
};

const updateSchedule = async (req, res) => {
  try {
    const { error, value } = updateScheduleValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const schedule = await scheduleService.updateSchedule(req.params.id, value);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: schedule,
      message: "Schedule updated successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to update schedule",
    });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const schedule = await scheduleService.deleteSchedule(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: schedule,
      message: "Schedule deleted successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to delete schedule",
    });
  }
};

module.exports = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  getScheduleByClassId,
  getScheduleByTeacherId,
  getScheduleByBatchId,   //  NEW
  updateSchedule,
  deleteSchedule,
};