const batchesService = require("../services/coachingBatches.service");
const statusCode = require("../enums/statusCode");
const {
  createBatchValidation,
  updateBatchValidation,
} = require("../validations/coachingBatches.validations");

const createBatch = async (req, res) => {
  try {
    const { error, value } = createBatchValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const batch = await batchesService.createBatch(value);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: batch,
      message: "Batch created successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to create batch",
    });
  }
};

const getAllBatches = async (req, res) => {
  try {
    const filters = {
      class_id: req.query.class_id,
      status: req.query.status,
    };

    const batches = await batchesService.getAllBatches(filters);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: batches,
      message: "Batches retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve batches",
    });
  }
};

const getBatchById = async (req, res) => {
  try {
    const batch = await batchesService.getBatchById(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: batch,
      message: "Batch retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve batch",
    });
  }
};

const getBatchesByClassId = async (req, res) => {
  try {
    const batches = await batchesService.getBatchesByClassId(
      req.params.class_id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: batches,
      message: "Batches retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve batches",
    });
  }
};

const updateBatch = async (req, res) => {
  try {
    const { error, value } = updateBatchValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const batch = await batchesService.updateBatch(req.params.id, value);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: batch,
      message: "Batch updated successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to update batch",
    });
  }
};

const deleteBatch = async (req, res) => {
  try {
    const batch = await batchesService.deleteBatch(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: batch,
      message: "Batch deleted successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to delete batch",
    });
  }
};

module.exports = {
  createBatch,
  getAllBatches,
  getBatchById,
  getBatchesByClassId,
  updateBatch,
  deleteBatch,
};