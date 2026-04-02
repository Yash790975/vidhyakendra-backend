const feeTermService = require("../services/feeTerm.service");
const statusCode = require("../enums/statusCode");
const {
  createFeeTermValidation,
  updateFeeTermValidation,
} = require("../validations/feeTerm.validations");

const createFeeTerm = async (req, res) => {
  try {
    const { error, value } = createFeeTermValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const feeTerm = await feeTermService.createFeeTerm(value);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: feeTerm,
      message: "Fee term created successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to create fee term",
    });
  }
};

const createBulkFeeTerms = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: "Request body must be a non-empty array of fee terms",
      });
    }

    const validatedTerms = [];
    for (let i = 0; i < req.body.length; i++) {
      const { error, value } = createFeeTermValidation.validate(req.body[i]);
      if (error) {
        return res.status(statusCode.BAD_REQUEST).json({
          success: false,
          isException: false,
          statusCode: statusCode.BAD_REQUEST,
          result: {},
          message: `Validation error at index ${i}: ${error.details[0].message}`,
        });
      }
      validatedTerms.push(value);
    }

    const feeTerms = await feeTermService.createBulkFeeTerms(validatedTerms);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: feeTerms,
      message: `${feeTerms.length} fee terms created successfully`,
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to create fee terms",
    });
  }
};

const getAllFeeTerms = async (req, res) => {
  try {
    const filters = {
      institute_id: req.query.institute_id,
      academic_year: req.query.academic_year,
      status: req.query.status,
    };

    const feeTerms = await feeTermService.getAllFeeTerms(filters);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: feeTerms,
      message: "Fee terms retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve fee terms",
    });
  }
};

const getFeeTermById = async (req, res) => {
  try {
    const feeTerm = await feeTermService.getFeeTermById(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: feeTerm,
      message: "Fee term retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve fee term",
    });
  }
};

const getFeeTermsByInstituteAndYear = async (req, res) => {
  try {
    const { institute_id, academic_year } = req.params;
    const feeTerms = await feeTermService.getFeeTermsByInstituteAndYear(
      institute_id,
      academic_year
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: feeTerms,
      message: "Fee terms retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve fee terms",
    });
  }
};

const updateFeeTerm = async (req, res) => {
  try {
    const { error, value } = updateFeeTermValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const feeTerm = await feeTermService.updateFeeTerm(req.params.id, value);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: feeTerm,
      message: "Fee term updated successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to update fee term",
    });
  }
};

const deleteFeeTerm = async (req, res) => {
  try {
    const feeTerm = await feeTermService.deleteFeeTerm(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: feeTerm,
      message: "Fee term deleted successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to delete fee term",
    });
  }
};

module.exports = {
  createFeeTerm,
  createBulkFeeTerms,
  getAllFeeTerms,
  getFeeTermById,
  getFeeTermsByInstituteAndYear,
  updateFeeTerm,
  deleteFeeTerm,
};
