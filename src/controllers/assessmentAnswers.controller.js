const assessmentAnswersService = require("../services/assessmentAnswers.service");
const statusCode = require("../enums/statusCode");
const {
  saveAnswerValidation,
  evaluateAnswerValidation,
} = require("../validations/assessmentAnswers.validations");

const saveAnswer = async (req, res) => {
  try {
    const { error, value } = saveAnswerValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const answer = await assessmentAnswersService.saveAnswer(value);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: answer,
      message: "Answer saved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to save answer",
    });
  }
};

const getAnswersByAttempt = async (req, res) => {
  try {
    const answers = await assessmentAnswersService.getAnswersByAttempt(
      req.params.attempt_id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: answers,
      message: "Answers retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve answers",
    });
  }
};

const evaluateAnswer = async (req, res) => {
  try {
    const { error, value } = evaluateAnswerValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const answer = await assessmentAnswersService.evaluateAnswer(req.params.id, value);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: answer,
      message: "Answer evaluated successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to evaluate answer",
    });
  }
};

module.exports = {
  saveAnswer,
  getAnswersByAttempt,
  evaluateAnswer,
};
