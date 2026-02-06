const mappingService = require("../services/studentAcademicMapping.service");
const statusCode = require("../enums/statusCode");
const {
  createMappingValidation,
  updateMappingValidation,
} = require("../validations/studentAcademicMapping.validations");

const createMapping = async (req, res) => {
  try {
    const { error, value } = createMappingValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const mapping = await mappingService.createMapping(value);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: mapping,
      message: "Student mapping created successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to create mapping",
    });
  }
};

const getAllMappings = async (req, res) => {
  try {
    const filters = {
      student_id: req.query.student_id,
      class_id: req.query.class_id,
      section_id: req.query.section_id,
      batch_id: req.query.batch_id,
      mapping_type: req.query.mapping_type,
      academic_year: req.query.academic_year,
      status: req.query.status,
    };

    const mappings = await mappingService.getAllMappings(filters);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: mappings,
      message: "Mappings retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve mappings",
    });
  }
};

const getMappingById = async (req, res) => {
  try {
    const mapping = await mappingService.getMappingById(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: mapping,
      message: "Mapping retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve mapping",
    });
  }
};

const getActiveStudentMappings = async (req, res) => {
  try {
    const mappings = await mappingService.getActiveStudentMappings(
      req.params.student_id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: mappings,
      message: "Active student mappings retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve active student mappings",
    });
  }
};

const getStudentMappingHistory = async (req, res) => {
  try {
    const mappings = await mappingService.getStudentMappingHistory(
      req.params.student_id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: mappings,
      message: "Student mapping history retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve student mapping history",
    });
  }
};

const getStudentsByClass = async (req, res) => {
  try {
    const { class_id } = req.params;
    const { section_id, academic_year } = req.query;

    const mappings = await mappingService.getStudentsByClass(
      class_id,
      section_id,
      academic_year
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: mappings,
      message: "Students retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve students",
    });
  }
};

const getStudentsByBatch = async (req, res) => {
  try {
    const { batch_id } = req.params;
    const { academic_year } = req.query;

    const mappings = await mappingService.getStudentsByBatch(
      batch_id,
      academic_year
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: mappings,
      message: "Students retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve students",
    });
  }
};

const updateMapping = async (req, res) => {
  try {
    const { error, value } = updateMappingValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const mapping = await mappingService.updateMapping(req.params.id, value);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: mapping,
      message: "Mapping updated successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to update mapping",
    });
  }
};

const deleteMapping = async (req, res) => {
  try {
    const result = await mappingService.deleteMapping(req.params.id);

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
      message: err.message || "Failed to delete mapping",
    });
  }
};

const promoteStudent = async (req, res) => {
  try {
    const { new_class_id, new_section_id } = req.body;

    const result = await mappingService.promoteStudent(
      req.params.id,
      new_class_id,
      new_section_id
    );

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
      message: err.message || "Failed to promote student",
    });
  }
};

module.exports = {
  createMapping,
  getAllMappings,
  getMappingById,
  getActiveStudentMappings,
  getStudentMappingHistory,
  getStudentsByClass,
  getStudentsByBatch,
  updateMapping,
  deleteMapping,
  promoteStudent,
};