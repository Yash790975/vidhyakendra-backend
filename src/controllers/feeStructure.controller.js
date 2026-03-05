const feeStructureService = require("../services/feeStructure.service");
const statusCode = require("../enums/statusCode");
const {
  createFeeStructureValidation,
  updateFeeStructureValidation,
} = require("../validations/feeStructure.validations");

const createFeeStructure = async (req, res) => {
  try {
    const { error, value } = createFeeStructureValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const feeStructure = await feeStructureService.createFeeStructure(value);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: feeStructure,
      message: "Fee structure created successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to create fee structure",
    });
  }
};

const getAllFeeStructures = async (req, res) => {
  try {
    const filters = {
      institute_id: req.query.institute_id,
      class_id: req.query.class_id,
      academic_year: req.query.academic_year,
      status: req.query.status,
    };

    const feeStructures = await feeStructureService.getAllFeeStructures(filters);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: feeStructures,
      message: "Fee structures retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve fee structures",
    });
  }
};

const getFeeStructureById = async (req, res) => {
  try {
    const feeStructure = await feeStructureService.getFeeStructureById(
      req.params.id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: feeStructure,
      message: "Fee structure retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve fee structure",
    });
  }
};

const getFeeStructuresByClass = async (req, res) => {
  try {
    const filters = {
      academic_year: req.query.academic_year,
      status: req.query.status,
    };

    const feeStructures = await feeStructureService.getFeeStructuresByClass(
      req.params.class_id,
      filters
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: feeStructures,
      message: "Fee structures retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve fee structures",
    });
  }
};

const updateFeeStructure = async (req, res) => {
  try {
    const { error, value } = updateFeeStructureValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const feeStructure = await feeStructureService.updateFeeStructure(
      req.params.id,
      value
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: feeStructure,
      message: "Fee structure updated successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to update fee structure",
    });
  }
};

const deleteFeeStructure = async (req, res) => {
  try {
    const feeStructure = await feeStructureService.deleteFeeStructure(
      req.params.id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: feeStructure,
      message: "Fee structure deleted successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to delete fee structure",
    });
  }
};

module.exports = {
  createFeeStructure,
  getAllFeeStructures,
  getFeeStructureById,
  getFeeStructuresByClass,
  updateFeeStructure,
  deleteFeeStructure,
};
