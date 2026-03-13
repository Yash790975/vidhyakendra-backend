const AssessmentAnswers = require("../models/assessmentAnswers.model");
const AssessmentAttempts = require("../models/assessmentAttempts.model");
const AssessmentQuestions = require("../models/assessmentQuestions.model");
const mongoose = require("mongoose");

const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");

const saveAnswer = async (answerData) => {
  // Ensure attempt is still in progress
  const attempt = await AssessmentAttempts.findById(answerData.attempt_id);

  if (!attempt) {
    throw new CustomError("Attempt not found", statusCode.NOT_FOUND);
  }

  if (attempt.status !== "in_progress") {
    throw new CustomError(
      "Cannot save answer — attempt is not in progress",
      statusCode.BAD_REQUEST
    );
  }

  // Upsert: update existing answer for this question in this attempt
  const existingAnswer = await AssessmentAnswers.findOne({
    attempt_id: answerData.attempt_id,
    question_id: answerData.question_id,
  });

  if (existingAnswer) {
    existingAnswer.selected_options = answerData.selected_options || null;
    existingAnswer.answer_text = answerData.answer_text || null;
    existingAnswer.is_skipped = answerData.is_skipped ?? null;
    await existingAnswer.save();
    return existingAnswer;
  }

  const answer = new AssessmentAnswers({
    institute_id: new mongoose.Types.ObjectId(answerData.institute_id),
    attempt_id: new mongoose.Types.ObjectId(answerData.attempt_id),
    assessment_id: new mongoose.Types.ObjectId(answerData.assessment_id),
    question_id: new mongoose.Types.ObjectId(answerData.question_id),
    student_id: new mongoose.Types.ObjectId(answerData.student_id),
    selected_options: answerData.selected_options || null,
    answer_text: answerData.answer_text || null,
    is_skipped: answerData.is_skipped ?? null,
  });

  await answer.save();
  return answer;
};

const getAnswersByAttempt = async (attemptId) => {
  const answers = await AssessmentAnswers.find({ attempt_id: attemptId }).populate(
    "question_id",
    "question_text question_type options correct_options correct_answer_text marks explanation order"
  );

  return answers;
};

const evaluateAnswer = async (answerId, evaluationData) => {
  const answer = await AssessmentAnswers.findById(answerId);

  if (!answer) {
    throw new CustomError("Answer not found", statusCode.NOT_FOUND);
  }

  const question = await AssessmentQuestions.findById(answer.question_id);

  if (!question || question.question_type !== "short_answer") {
    throw new CustomError(
      "Only short answer questions can be manually evaluated",
      statusCode.BAD_REQUEST
    );
  }

  const teacherMarks = evaluationData.teacher_marks;
  const isCorrect = teacherMarks >= question.marks;

  answer.teacher_marks = teacherMarks;
  answer.teacher_feedback = evaluationData.teacher_feedback || null;
  answer.marks_awarded = teacherMarks;
  answer.is_correct = isCorrect;

  await answer.save();
  return answer;
};

module.exports = {
  saveAnswer,
  getAnswersByAttempt,
  evaluateAnswer,
};
