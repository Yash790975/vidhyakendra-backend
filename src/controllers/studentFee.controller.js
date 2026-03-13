const studentFeeService = require("../services/studentFee.service");
const statusCode = require("../enums/statusCode");
const {
  createStudentFeeValidation,
  updateStudentFeeValidation, 
  applyLateFeeValidation,
} = require("../validations/studentFee.validations");

const createStudentFee = async (req, res) => {
  try {
    const { error, value } = createStudentFeeValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const studentFee = await studentFeeService.createStudentFee(value);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: studentFee,
      message: "Student fee record created successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to create student fee record",
    });
  }
};

const generateStudentFeeForTerm = async (req, res) => {
  try {
    const required = [
      "institute_id",
      "student_id",
      "class_id",
      "academic_year",
      "term_id",
      "fee_structure_id",
    ];

    for (const field of required) {
      if (!req.body[field]) {
        return res.status(statusCode.BAD_REQUEST).json({
          success: false,
          isException: false,
          statusCode: statusCode.BAD_REQUEST,
          result: {},
          message: `${field} is required`,
        });
      }
    }

    const studentFee = await studentFeeService.generateStudentFeeForTerm(
      req.body
    );

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: studentFee,
      message: "Student fee generated successfully for the term",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to generate student fee",
    });
  }
};

const getAllStudentFees = async (req, res) => {
  try {
    const filters = {
      institute_id: req.query.institute_id,
      student_id: req.query.student_id,
      academic_year: req.query.academic_year,
      class_id: req.query.class_id,
      status: req.query.status,
    };

    const studentFees = await studentFeeService.getAllStudentFees(filters);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: studentFees,
      message: "Student fee records retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve student fee records",
    });
  }
};

const getStudentFeeById = async (req, res) => {
  try {
    const studentFee = await studentFeeService.getStudentFeeById(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: studentFee,
      message: "Student fee record retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve student fee record",
    });
  }
};

const getStudentFeesByStudentId = async (req, res) => {
  try {
    const filters = {
      academic_year: req.query.academic_year,
      status: req.query.status,
    };

    const studentFees = await studentFeeService.getStudentFeesByStudentId(
      req.params.student_id,
      filters
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: studentFees,
      message: "Student fee records retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve student fee records",
    });
  }
};

const updateStudentFee = async (req, res) => {
  try {
    const { error, value } = updateStudentFeeValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const studentFee = await studentFeeService.updateStudentFee(
      req.params.id,
      value
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: studentFee,
      message: "Student fee record updated successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to update student fee record",
    });
  }
};

const applyLateFee = async (req, res) => {
  try {
    const { error, value } = applyLateFeeValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const studentFee = await studentFeeService.applyLateFee(
      req.params.id,
      value.late_fee_amount
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: studentFee,
      message: "Late fee applied successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to apply late fee",
    });
  }
};

const deleteStudentFee = async (req, res) => {
  try {
    const studentFee = await studentFeeService.deleteStudentFee(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: studentFee,
      message: "Student fee record deleted successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to delete student fee record",
    });
  }
};

module.exports = {
  createStudentFee,
  generateStudentFeeForTerm,
  getAllStudentFees,
  getStudentFeeById,
  getStudentFeesByStudentId,
  updateStudentFee,
  applyLateFee,
  deleteStudentFee,
};
