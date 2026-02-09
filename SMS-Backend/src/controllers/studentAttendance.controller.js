const studentAttendanceService = require('../services/studentAttendance.service');
const {
  createAttendanceValidation,
  bulkCreateAttendanceValidation,
  updateAttendanceValidation
} = require('../validations/studentAttendance.validation');
const statusCode = require('../enums/statusCode');
const apiResponse = require('../utils/apiResponse');

const createAttendance = async (req, res) => {
  try {
    const { error } = createAttendanceValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json(
        apiResponse({
          success: false,
          isException: false,
          statusCode: statusCode.BAD_REQUEST,
          result: null,
          message: error.details[0].message
        })
      );
    }

    const attendance = await studentAttendanceService.createAttendance(req.body);

    return res.status(statusCode.CREATED).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.CREATED,
        result: attendance,
        message: 'Attendance created successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while creating attendance'
      })
    );
  }
};

const bulkCreateAttendance = async (req, res) => {
  try {
    const { error } = bulkCreateAttendanceValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json(
        apiResponse({
          success: false,
          isException: false,
          statusCode: statusCode.BAD_REQUEST,
          result: null,
          message: error.details[0].message
        })
      );
    }

    const result = await studentAttendanceService.bulkCreateAttendance(req.body.attendances);

    return res.status(statusCode.CREATED).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.CREATED,
        result: result,
        message: `Bulk attendance created: ${result.created} succeeded, ${result.failed} failed`
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while creating bulk attendance'
      })
    );
  }
};

const getAllAttendance = async (req, res) => {
  try {
    const attendance = await studentAttendanceService.getAllAttendance();

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: attendance,
        message: 'Attendance records retrieved successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while fetching attendance'
      })
    );
  }
};

const getAttendanceById = async (req, res) => {
  try {
    const attendance = await studentAttendanceService.getAttendanceById(req.params.id);

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: attendance,
        message: 'Attendance record retrieved successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while fetching attendance'
      })
    );
  }
};

const getAttendanceByStudentId = async (req, res) => {
  try {
    const attendance = await studentAttendanceService.getAttendanceByStudentId(
      req.params.student_id
    );

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: attendance,
        message: 'Attendance records retrieved successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while fetching attendance'
      })
    );
  }
};

const getAttendanceByClassId = async (req, res) => {
  try {
    const attendance = await studentAttendanceService.getAttendanceByClassId(
      req.params.class_id
    );

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: attendance,
        message: 'Attendance records retrieved successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while fetching attendance'
      })
    );
  }
};

const getAttendanceByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const attendance = await studentAttendanceService.getAttendanceByDate(date);

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: attendance,
        message: 'Attendance records retrieved successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while fetching attendance'
      })
    );
  }
};

const getAttendanceByDateRange = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(statusCode.BAD_REQUEST).json(
        apiResponse({
          success: false,
          isException: false,
          statusCode: statusCode.BAD_REQUEST,
          result: null,
          message: 'start_date and end_date query parameters are required'
        })
      );
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    const attendance = await studentAttendanceService.getAttendanceByDateRange(
      startDate,
      endDate
    );

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: attendance,
        message: 'Attendance records retrieved successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while fetching attendance'
      })
    );
  }
};

const getAttendanceByTeacherId = async (req, res) => {
  try {
    const attendance = await studentAttendanceService.getAttendanceByTeacherId(
      req.params.teacher_id
    );

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: attendance,
        message: 'Attendance records retrieved successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while fetching attendance'
      })
    );
  }
};

const getAttendanceByStatus = async (req, res) => {
  try {
    const attendance = await studentAttendanceService.getAttendanceByStatus(
      req.params.status
    );

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: attendance,
        message: 'Attendance records retrieved successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while fetching attendance'
      })
    );
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { error } = updateAttendanceValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json(
        apiResponse({
          success: false,
          isException: false,
          statusCode: statusCode.BAD_REQUEST,
          result: null,
          message: error.details[0].message
        })
      );
    }

    const attendance = await studentAttendanceService.updateAttendance(
      req.params.id,
      req.body
    );

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: attendance,
        message: 'Attendance updated successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while updating attendance'
      })
    );
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const result = await studentAttendanceService.deleteAttendance(req.params.id);

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: result,
        message: 'Attendance deleted successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while deleting attendance'
      })
    );
  }
};

const getAttendanceStatsByStudent = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const startDate = start_date ? new Date(start_date) : null;
    const endDate = end_date ? new Date(end_date) : null;

    const stats = await studentAttendanceService.getAttendanceStatsByStudent(
      req.params.student_id,
      startDate,
      endDate
    );

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: stats,
        message: 'Attendance statistics retrieved successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while fetching attendance statistics'
      })
    );
  }
};

module.exports = {
  createAttendance,
  bulkCreateAttendance,
  getAllAttendance,
  getAttendanceById,
  getAttendanceByStudentId,
  getAttendanceByClassId,
  getAttendanceByDate,
  getAttendanceByDateRange,
  getAttendanceByTeacherId,
  getAttendanceByStatus,
  updateAttendance,
  deleteAttendance,
  getAttendanceStatsByStudent
};