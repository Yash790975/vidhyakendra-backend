

const teachersService = require("../services/teacherBankDetails.service");
const statusCode = require("../enums/statusCode");
const {
  createBankDetailsValidation
} = require("../validations/teacherBankDetails.validations");

  
// ============= BANK DETAILS =============

const createBankDetails = async (req, res) => {  
  try {
    const { error, value } = createBankDetailsValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const bankDetails = await teachersService.createBankDetails(value);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: bankDetails,
      message: "Bank details created successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to create bank details",
    });
  }
};

const getBankDetailsByTeacherId = async (req, res) => {
  try {
    const bankDetails = await teachersService.getBankDetailsByTeacherId(
      req.params.teacher_id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: bankDetails,
      message: "Bank details retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve bank details",
    });
  }
};

const updateBankDetails = async (req, res) => {
  try {
    const bankDetails = await teachersService.updateBankDetails(
      req.params.id,
      req.body
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: bankDetails,
      message: "Bank details updated successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to update bank details",
    });
  }
};

const deleteBankDetails = async (req, res) => {
  try {
    const bankDetails = await teachersService.deleteBankDetails(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: bankDetails,
      message: "Bank details deleted successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to delete bank details",
    });
  }
};

const getAllBankDetails = async (req, res) => {
  try {
    const bankDetails = await teachersService.getAllBankDetails();

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: bankDetails,
      message: "All bank details retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve bank details",
    });
  }
};

const getBankDetailsById = async (req, res) => {
  try {
    const bankDetails = await teachersService.getBankDetailsById(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: bankDetails,
      message: "Bank details retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve bank details",
    });
  }
};

module.exports = {
  // Bank Details
  createBankDetails,
  getAllBankDetails,
  getBankDetailsById,
  getBankDetailsByTeacherId,
  updateBankDetails,
  deleteBankDetails
};
