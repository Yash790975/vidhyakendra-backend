const assessmentQuestionsService = require("../services/assessmentQuestions.service");
const statusCode = require("../enums/statusCode");
const {
  createAssessmentQuestionValidation,
  updateAssessmentQuestionValidation,
} = require("../validations/assessmentQuestions.validations");

const addQuestion = async (req, res) => {
  try {
    const { error, value } = createAssessmentQuestionValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const question = await assessmentQuestionsService.addQuestion(value);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: question,
      message: "Question added successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to add question",
    });
  }
};

const getQuestionsByAssessment = async (req, res) => {
  try {
    const questions = await assessmentQuestionsService.getQuestionsByAssessment(
      req.params.assessment_id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: questions,
      message: "Questions retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve questions",
    });
  }
};

const getQuestionById = async (req, res) => {
  try {
    const question = await assessmentQuestionsService.getQuestionById(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: question,
      message: "Question retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve question",
    });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { error, value } = updateAssessmentQuestionValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const question = await assessmentQuestionsService.updateQuestion(req.params.id, value);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: question,
      message: "Question updated successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to update question",
    });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const result = await assessmentQuestionsService.deleteQuestion(req.params.id);

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
      message: err.message || "Failed to delete question",
    });
  }
};

module.exports = {
  addQuestion,
  getQuestionsByAssessment,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};
