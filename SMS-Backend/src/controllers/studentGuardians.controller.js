const guardianService = require("../services/studentGuardians.service");
const statusCode = require("../enums/statusCode");
const {
  createGuardianValidation,
  updateGuardianValidation,
} = require("../validations/studentGuardians.validations");

const createGuardian = async (req, res) => {
  try {
    const { error, value } = createGuardianValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const guardian = await guardianService.createGuardian(value);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: guardian,
      message: "Guardian created successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to create guardian",
    });
  }
};

const getAllGuardians = async (req, res) => {
  try {
    const filters = {
      student_id: req.query.student_id,
      relation: req.query.relation,
      is_primary: req.query.is_primary,
    };

    const guardians = await guardianService.getAllGuardians(filters);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: guardians,
      message: "Guardians retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve guardians",
    });
  }
};

const getGuardianById = async (req, res) => {
  try {
    const guardian = await guardianService.getGuardianById(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: guardian,
      message: "Guardian retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve guardian",
    });
  }
};

const getGuardiansByStudentId = async (req, res) => {
  try {
    const guardians = await guardianService.getGuardiansByStudentId(
      req.params.student_id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: guardians,
      message: "Student guardians retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve student guardians",
    });
  }
};

const getPrimaryGuardian = async (req, res) => {
  try {
    const guardian = await guardianService.getPrimaryGuardian(
      req.params.student_id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: guardian,
      message: "Primary guardian retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve primary guardian",
    });
  }
};

const updateGuardian = async (req, res) => {
  try {
    const { error, value } = updateGuardianValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const guardian = await guardianService.updateGuardian(
      req.params.id,
      value
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: guardian,
      message: "Guardian updated successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to update guardian",
    });
  }
};

const deleteGuardian = async (req, res) => {
  try {
    const result = await guardianService.deleteGuardian(req.params.id);

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
      message: err.message || "Failed to delete guardian",
    });
  }
};

module.exports = {
  createGuardian,
  getAllGuardians,
  getGuardianById,
  getGuardiansByStudentId,
  getPrimaryGuardian,
  updateGuardian,
  deleteGuardian,
};