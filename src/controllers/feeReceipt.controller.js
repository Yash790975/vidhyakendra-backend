const feeReceiptService = require("../services/feeReceipt.service");
const statusCode = require("../enums/statusCode");
const {
  createFeeReceiptValidation,
} = require("../validations/feeReceipt.validations"); 

const createFeeReceipt = async (req, res) => {
  try {
    const { error, value } = createFeeReceiptValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const receipt = await feeReceiptService.createFeeReceipt(value);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: receipt,
      message: "Fee receipt created successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to create fee receipt",
    });
  }
};

const getAllFeeReceipts = async (req, res) => {
  try {
    const filters = {
      institute_id: req.query.institute_id,
      student_id: req.query.student_id,
    };

    const receipts = await feeReceiptService.getAllFeeReceipts(filters);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: receipts,
      message: "Fee receipts retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve fee receipts",
    });
  }
};

const getFeeReceiptById = async (req, res) => {
  try {
    const receipt = await feeReceiptService.getFeeReceiptById(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: receipt,
      message: "Fee receipt retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve fee receipt",
    });
  }
};

const getFeeReceiptsByStudentId = async (req, res) => {
  try {
    const receipts = await feeReceiptService.getFeeReceiptsByStudentId(
      req.params.student_id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: receipts,
      message: "Fee receipts retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve fee receipts",
    });
  }
};

const getFeeReceiptsByStudentFeeId = async (req, res) => {
  try {
    const receipts = await feeReceiptService.getFeeReceiptsByStudentFeeId(
      req.params.student_fee_id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: receipts,
      message: "Fee receipts retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve fee receipts",
    });
  }
};

const deleteFeeReceipt = async (req, res) => {
  try {
    const receipt = await feeReceiptService.deleteFeeReceipt(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: receipt,
      message: "Fee receipt deleted successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to delete fee receipt",
    });
  }
};

module.exports = {
  createFeeReceipt,
  getAllFeeReceipts,
  getFeeReceiptById,
  getFeeReceiptsByStudentId,
  getFeeReceiptsByStudentFeeId,
  deleteFeeReceipt,
};
