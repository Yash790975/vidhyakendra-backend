const AssessmentQuestions = require("../models/assessmentQuestions.model");
const Assessments = require("../models/assessments.model");
const mongoose = require("mongoose");

const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");

// Recalculate and update total_marks on the parent assessment
const recalculateTotalMarks = async (assessmentId) => {
  const allQuestions = await AssessmentQuestions.find({ assessment_id: assessmentId });
  const totalMarks = allQuestions.reduce((sum, q) => sum + q.marks, 0);
  await Assessments.findByIdAndUpdate(assessmentId, { total_marks: totalMarks });
};

const addQuestion = async (questionData) => {
  // Validate assessment exists
  const assessment = await Assessments.findById(questionData.assessment_id);
  if (!assessment) {
    throw new CustomError("Assessment not found", statusCode.NOT_FOUND);
  }

  // MCQ-specific validations
  if (questionData.question_type === "mcq") {
    if (!questionData.options || questionData.options.length < 2) {
      throw new CustomError(
        "MCQ questions must have at least 2 options",
        statusCode.BAD_REQUEST
      );
    }
    if (!questionData.correct_options || questionData.correct_options.length === 0) {
      throw new CustomError(
        "MCQ questions must have at least one correct option",
        statusCode.BAD_REQUEST
      );
    }
  }

  const question = new AssessmentQuestions({
    institute_id: new mongoose.Types.ObjectId(questionData.institute_id),
    assessment_id: new mongoose.Types.ObjectId(questionData.assessment_id),
    question_text: questionData.question_text,
    question_type: questionData.question_type,
    options: questionData.question_type === "mcq" ? questionData.options : null,
    correct_options:
      questionData.question_type === "mcq" ? questionData.correct_options : null,
    correct_answer_text:
      questionData.question_type === "short_answer"
        ? questionData.correct_answer_text || null
        : null,
    marks: questionData.marks,
    hint: questionData.hint || null,
    explanation: questionData.explanation || null,
    order: questionData.order,
  });

  await question.save();
  await recalculateTotalMarks(questionData.assessment_id);

  return question;
};

const getQuestionsByAssessment = async (assessmentId) => {
  const questions = await AssessmentQuestions.find({
    assessment_id: assessmentId,
  }).sort({ order: 1 });

  return questions;
};

const getQuestionById = async (questionId) => {
  const question = await AssessmentQuestions.findById(questionId);

  if (!question) {
    throw new CustomError("Question not found", statusCode.NOT_FOUND);
  }

  return question;
};

const updateQuestion = async (questionId, updateData) => {
  const question = await AssessmentQuestions.findById(questionId);

  if (!question) {
    throw new CustomError("Question not found", statusCode.NOT_FOUND);
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      question[key] = updateData[key];
    }
  });

  await question.save();
  await recalculateTotalMarks(question.assessment_id);

  return question;
};

const deleteQuestion = async (questionId) => {
  const question = await AssessmentQuestions.findById(questionId);

  if (!question) {
    throw new CustomError("Question not found", statusCode.NOT_FOUND);
  }

  const assessmentId = question.assessment_id;
  await AssessmentQuestions.findByIdAndDelete(questionId);
  await recalculateTotalMarks(assessmentId);

  return { message: "Question deleted successfully" };
};

module.exports = {
  addQuestion,
  getQuestionsByAssessment,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};
