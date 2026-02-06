const studentStatusHistoryService = require('../services/studentStatusHistory.service');
const {
  createStatusHistoryValidation,
  updateStatusHistoryValidation
} = require('../validations/studentStatusHistory.validation');
const statusCode = require('../enums/statusCode');
const apiResponse = require('../utils/apiResponse');

const createStatusHistory = async (req, res) => {
  try {
    const { error } = createStatusHistoryValidation.validate(req.body);
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

    const history = await studentStatusHistoryService.createStatusHistory(req.body);

    return res.status(statusCode.CREATED).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.CREATED,
        result: history,
        message: 'Status history created successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while creating status history'
      })
    );
  }
};

const getAllStatusHistories = async (req, res) => {
  try {
    const histories = await studentStatusHistoryService.getAllStatusHistories();

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: histories,
        message: 'Status histories retrieved successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while fetching status histories'
      })
    );
  }
};

const getStatusHistoryById = async (req, res) => {
  try {
    const history = await studentStatusHistoryService.getStatusHistoryById(req.params.id);

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: history,
        message: 'Status history retrieved successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while fetching status history'
      })
    );
  }
};

const getStatusHistoriesByStudentId = async (req, res) => {
  try {
    const histories = await studentStatusHistoryService.getStatusHistoriesByStudentId(
      req.params.student_id
    );

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: histories,
        message: 'Status histories retrieved successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while fetching status histories'
      })
    );
  }
};

const getStatusHistoriesByStatus = async (req, res) => {
  try {
    const histories = await studentStatusHistoryService.getStatusHistoriesByStatus(
      req.params.status
    );

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: histories,
        message: 'Status histories retrieved successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while fetching status histories'
      })
    );
  }
};

const getStatusHistoriesByAdminId = async (req, res) => {
  try {
    const histories = await studentStatusHistoryService.getStatusHistoriesByAdminId(
      req.params.admin_id
    );

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: histories,
        message: 'Status histories retrieved successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while fetching status histories'
      })
    );
  }
};

const updateStatusHistory = async (req, res) => {
  try {
    const { error } = updateStatusHistoryValidation.validate(req.body);
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

    const history = await studentStatusHistoryService.updateStatusHistory(
      req.params.id,
      req.body
    );

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: history,
        message: 'Status history updated successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while updating status history'
      })
    );
  }
};

const deleteStatusHistory = async (req, res) => {
  try {
    const result = await studentStatusHistoryService.deleteStatusHistory(req.params.id);

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: result,
        message: 'Status history deleted successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while deleting status history'
      })
    );
  }
};

module.exports = {
  createStatusHistory,
  getAllStatusHistories,
  getStatusHistoryById,
  getStatusHistoriesByStudentId,
  getStatusHistoriesByStatus,
  getStatusHistoriesByAdminId,
  updateStatusHistory,
  deleteStatusHistory
};