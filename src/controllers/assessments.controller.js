const assessmentsService = require("../services/assessments.service");
const statusCode = require("../enums/statusCode");
const {
  createAssessmentValidation,
  updateAssessmentValidation,
} = require("../validations/assessments.validations");

const createAssessment = async (req, res) => {
  try {
    const { error, value } = createAssessmentValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const assessment = await assessmentsService.createAssessment(value);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: assessment,
      message: "Assessment created successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to create assessment",
    });
  }
};

const getAllAssessments = async (req, res) => {
  try {
    const filters = {
      institute_id: req.query.institute_id,
      class_id: req.query.class_id,
      section_id: req.query.section_id,
      batch_id: req.query.batch_id,
      subject_id: req.query.subject_id,
      created_by: req.query.created_by,
      status: req.query.status,
      assessment_type: req.query.assessment_type,
      academic_year: req.query.academic_year,
      available_now: req.query.available_now,
    };

    const assessments = await assessmentsService.getAllAssessments(filters);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: assessments,
      message: "Assessments retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve assessments",
    });
  }
};

const getAssessmentById = async (req, res) => {
  try {
    const assessment = await assessmentsService.getAssessmentById(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: assessment,
      message: "Assessment retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve assessment",
    });
  }
};

const updateAssessment = async (req, res) => {
  try {
    const { error, value } = updateAssessmentValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const assessment = await assessmentsService.updateAssessment(req.params.id, value);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: assessment,
      message: "Assessment updated successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to update assessment",
    });
  }
};

const deleteAssessment = async (req, res) => {
  try {
    const result = await assessmentsService.deleteAssessment(req.params.id);

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
      message: err.message || "Failed to delete assessment",
    });
  }
};

const getAssessmentAnalytics = async (req, res) => {
  try {
    const analytics = await assessmentsService.getAssessmentAnalytics(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: analytics,
      message: "Assessment analytics retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve assessment analytics",
    });
  }
};

module.exports = {
  createAssessment,
  getAllAssessments,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  getAssessmentAnalytics,
};
