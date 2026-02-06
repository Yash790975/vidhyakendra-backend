const classSubjectsService = require("../services/classSubjects.service");
const statusCode = require("../enums/statusCode");
const {
  createClassSubjectValidation,
  updateClassSubjectValidation,
} = require("../validations/classSubjects.validations");

const createClassSubject = async (req, res) => {
  try {
    const { error, value } = createClassSubjectValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const classSubject = await classSubjectsService.createClassSubject(value);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: classSubject,
      message: "Subject assigned to class successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to assign subject to class",
    });
  }
};

const getAllClassSubjects = async (req, res) => {
  try {
    const filters = {
      class_id: req.query.class_id,
      subject_id: req.query.subject_id,
      is_compulsory: req.query.is_compulsory,
    };

    const classSubjects = await classSubjectsService.getAllClassSubjects(
      filters
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: classSubjects,
      message: "Class subjects retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve class subjects",
    });
  }
};

const getClassSubjectById = async (req, res) => {
  try {
    const classSubject = await classSubjectsService.getClassSubjectById(
      req.params.id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: classSubject,
      message: "Class subject retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve class subject",
    });
  }
};

const getSubjectsByClassId = async (req, res) => {
  try {
    const classSubjects = await classSubjectsService.getSubjectsByClassId(
      req.params.class_id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: classSubjects,
      message: "Subjects retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve subjects",
    });
  }
};

const updateClassSubject = async (req, res) => {
  try {
    const { error, value } = updateClassSubjectValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const classSubject = await classSubjectsService.updateClassSubject(
      req.params.id,
      value
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: classSubject,
      message: "Class subject updated successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to update class subject",
    });
  }
};

const deleteClassSubject = async (req, res) => {
  try {
    const classSubject = await classSubjectsService.deleteClassSubject(
      req.params.id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: classSubject,
      message: "Subject removed from class successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to remove subject from class",
    });
  }
};

module.exports = {
  createClassSubject,
  getAllClassSubjects,
  getClassSubjectById,
  getSubjectsByClassId,
  updateClassSubject,
  deleteClassSubject,
};