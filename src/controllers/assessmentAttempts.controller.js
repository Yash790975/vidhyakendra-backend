const assessmentAttemptsService = require("../services/assessmentAttempts.service");
const statusCode = require("../enums/statusCode");
const {
  startSchoolAttemptValidation,
  startCoachingAttemptValidation,
  evaluateAttemptValidation, 
} = require("../validations/assessmentAttempts.validations");

const startAttempt = async (req, res) => {
  try {
    //  Route to the correct schema based on institute_type
    const instituteType = req.body.institute_type;

    let schema;
    if (instituteType === "school") {
      schema = startSchoolAttemptValidation;
    } else if (instituteType === "coaching") {
      schema = startCoachingAttemptValidation;
    } else {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: "institute_type is required and must be 'school' or 'coaching'",
      });
    }

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const attempt = await assessmentAttemptsService.startAttempt(value);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: attempt,
      message: "Assessment attempt started successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to start attempt",
    });
  }
};

const submitAttempt = async (req, res) => {
  try {
    const attempt = await assessmentAttemptsService.submitAttempt(req.params.id);

    res.status(statusCode.OK).json({
      success: true, isException: false,
      statusCode: statusCode.OK, result: attempt,
      message: "Assessment submitted successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false, isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR, result: {},
      message: err.message || "Failed to submit assessment",
    });
  }
};

const getAttemptById = async (req, res) => {
  try {
    const attempt = await assessmentAttemptsService.getAttemptById(req.params.id);

    res.status(statusCode.OK).json({
      success: true, isException: false,
      statusCode: statusCode.OK, result: attempt,
      message: "Attempt retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false, isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR, result: {},
      message: err.message || "Failed to retrieve attempt",
    });
  }
};

const getAttemptsByAssessment = async (req, res) => {
  try {
    const filters = {
      student_id: req.query.student_id,
      status: req.query.status,
      section_id: req.query.section_id,
      batch_id: req.query.batch_id,
    };

    const attempts = await assessmentAttemptsService.getAttemptsByAssessment(
      req.params.assessment_id,
      filters
    );

    res.status(statusCode.OK).json({
      success: true, isException: false,
      statusCode: statusCode.OK, result: attempts,
      message: "Attempts retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false, isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR, result: {},
      message: err.message || "Failed to retrieve attempts",
    });
  }
};

const getAttemptsByStudent = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      assessment_id: req.query.assessment_id,
      institute_type: req.query.institute_type,             //  NEW
    };

    const attempts = await assessmentAttemptsService.getAttemptsByStudent(
      req.params.student_id,
      filters
    );

    res.status(statusCode.OK).json({
      success: true, isException: false,
      statusCode: statusCode.OK, result: attempts,
      message: "Student attempts retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false, isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR, result: {},
      message: err.message || "Failed to retrieve student attempts",
    });
  }
};

const markAttemptEvaluated = async (req, res) => {
  try {
    const { error, value } = evaluateAttemptValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false, isException: false,
        statusCode: statusCode.BAD_REQUEST, result: {},
        message: error.details[0].message,
      });
    }

    const attempt = await assessmentAttemptsService.markAttemptEvaluated(
      req.params.id, value
    );

    res.status(statusCode.OK).json({
      success: true, isException: false,
      statusCode: statusCode.OK, result: attempt,
      message: "Attempt marked as evaluated successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false, isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR, result: {},
      message: err.message || "Failed to mark attempt as evaluated",
    });
  }
};

module.exports = {
  startAttempt,
  submitAttempt,
  getAttemptById,
  getAttemptsByAssessment,
  getAttemptsByStudent,
  markAttemptEvaluated,
};
