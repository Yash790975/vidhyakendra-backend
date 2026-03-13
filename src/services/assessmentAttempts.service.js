const AssessmentAttempts = require("../models/assessmentAttempts.model");
const AssessmentAnswers = require("../models/assessmentAnswers.model");
const AssessmentQuestions = require("../models/assessmentQuestions.model");
const Assessments = require("../models/assessments.model");
const mongoose = require("mongoose");

const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");

const startAttempt = async (attemptData) => {
  const assessment = await Assessments.findById(attemptData.assessment_id);

  if (!assessment) {
    throw new CustomError("Assessment not found", statusCode.NOT_FOUND);
  }

  if (assessment.status !== "published") {
    throw new CustomError("Assessment is not available", statusCode.BAD_REQUEST);
  }

  // Check availability window
  const now = new Date();
  if (assessment.available_from && now < assessment.available_from) {
    throw new CustomError("Assessment has not started yet", statusCode.BAD_REQUEST);
  }
  if (assessment.available_until && now > assessment.available_until) {
    throw new CustomError("Assessment has expired", statusCode.BAD_REQUEST);
  }

  // Check max attempts
  const completedAttempts = await AssessmentAttempts.countDocuments({
    assessment_id: attemptData.assessment_id,
    student_id: attemptData.student_id,
    status: { $in: ["submitted", "auto_submitted"] },
  });

  if (
    assessment.max_attempts !== null &&
    completedAttempts >= assessment.max_attempts
  ) {
    throw new CustomError(
      `Maximum attempts (${assessment.max_attempts}) reached for this assessment`,
      statusCode.BAD_REQUEST
    );
  }

  // Check if already in progress
  const inProgress = await AssessmentAttempts.findOne({
    assessment_id: attemptData.assessment_id,
    student_id: attemptData.student_id,
    status: "in_progress",
  });

  if (inProgress) {
    throw new CustomError(
      "You already have an attempt in progress for this assessment",
      statusCode.BAD_REQUEST
    );
  }

  const attempt = new AssessmentAttempts({
    institute_id: new mongoose.Types.ObjectId(attemptData.institute_id),
    assessment_id: new mongoose.Types.ObjectId(attemptData.assessment_id),
    student_id: new mongoose.Types.ObjectId(attemptData.student_id),
    class_id: attemptData.class_id
      ? new mongoose.Types.ObjectId(attemptData.class_id)
      : null,
    section_id: attemptData.section_id
      ? new mongoose.Types.ObjectId(attemptData.section_id)
      : null,
    batch_id: attemptData.batch_id
      ? new mongoose.Types.ObjectId(attemptData.batch_id)
      : null,
    attempt_number: completedAttempts + 1,
    started_at: new Date(),
    status: "in_progress",
  });

  await attempt.save();
  return attempt;
};

const submitAttempt = async (attemptId, submitData) => {
  const attempt = await AssessmentAttempts.findById(attemptId);

  if (!attempt) {
    throw new CustomError("Attempt not found", statusCode.NOT_FOUND);
  }

  if (attempt.status !== "in_progress") {
    throw new CustomError("Attempt is not in progress", statusCode.BAD_REQUEST);
  }

  const assessment = await Assessments.findById(attempt.assessment_id);
  const answers = await AssessmentAnswers.find({ attempt_id: attemptId });
  const questions = await AssessmentQuestions.find({
    assessment_id: attempt.assessment_id,
  });

  // Auto-evaluate MCQ answers
  let mcqMarksObtained = 0;
  let hasShortAnswer = false;

  for (const answer of answers) {
    const question = questions.find(
      (q) => q._id.toString() === answer.question_id.toString()
    );

    if (!question) continue;

    if (question.question_type === "mcq") {
      const selectedOptions = answer.selected_options || [];
      const correctOptions = question.correct_options || [];

      const isCorrect =
        correctOptions.length === selectedOptions.length &&
        correctOptions.every((opt) => selectedOptions.includes(opt));

      const marksAwarded = isCorrect ? question.marks : 0;

      await AssessmentAnswers.findByIdAndUpdate(answer._id, {
        is_correct: isCorrect,
        marks_awarded: marksAwarded,
      });

      mcqMarksObtained += marksAwarded;
    } else if (question.question_type === "short_answer") {
      hasShortAnswer = true;
    }
  }

  const totalMarks = assessment.total_marks || 0;
  const marksObtained = mcqMarksObtained;
  const percentage =
    totalMarks > 0 ? ((marksObtained / totalMarks) * 100).toFixed(2) : 0;
  const isPass =
    assessment.pass_marks !== null
      ? marksObtained >= assessment.pass_marks
      : null;

  attempt.status = submitData.status || "submitted";
  attempt.submitted_at = new Date();
  attempt.time_taken_seconds = submitData.time_taken_seconds || null;
  attempt.total_marks = totalMarks;
  attempt.marks_obtained = marksObtained;
  attempt.percentage = parseFloat(percentage);
  attempt.is_pass = isPass;
  attempt.is_evaluated = !hasShortAnswer; // true only if no short answers pending

  await attempt.save();

  return await AssessmentAttempts.findById(attemptId)
    .populate("assessment_id", "title total_marks pass_marks show_result_immediately show_answer_key")
    .populate("student_id", "full_name roll_number");
};

const getAttemptById = async (attemptId) => {
  const attempt = await AssessmentAttempts.findById(attemptId)
    .populate("assessment_id", "title total_marks pass_marks show_result_immediately show_answer_key duration_minutes")
    .populate("student_id", "full_name roll_number")
    .populate("evaluated_by", "full_name teacher_code");

  if (!attempt) {
    throw new CustomError("Attempt not found", statusCode.NOT_FOUND);
  }

  return attempt;
};

const getAttemptsByAssessment = async (assessmentId, filters = {}) => {
  const query = { assessment_id: assessmentId };

  if (filters.student_id) query.student_id = new mongoose.Types.ObjectId(filters.student_id);
  if (filters.status) query.status = filters.status;
  if (filters.section_id) query.section_id = new mongoose.Types.ObjectId(filters.section_id);
  if (filters.batch_id) query.batch_id = new mongoose.Types.ObjectId(filters.batch_id);

  const attempts = await AssessmentAttempts.find(query)
    .populate("student_id", "full_name roll_number")
    .populate("evaluated_by", "full_name teacher_code")
    .sort({ submitted_at: -1, started_at: -1 });

  return attempts;
};

const getAttemptsByStudent = async (studentId, filters = {}) => {
  const query = { student_id: studentId };

  if (filters.status) query.status = filters.status;
  if (filters.assessment_id)
    query.assessment_id = new mongoose.Types.ObjectId(filters.assessment_id);

  const attempts = await AssessmentAttempts.find(query)
    .populate("assessment_id", "title subject_id total_marks pass_marks show_result_immediately")
    .sort({ started_at: -1 });

  return attempts;
};

const markAttemptEvaluated = async (attemptId, evaluationData) => {
  const attempt = await AssessmentAttempts.findById(attemptId);

  if (!attempt) {
    throw new CustomError("Attempt not found", statusCode.NOT_FOUND);
  }

  // Recalculate total marks after teacher has evaluated short answers
  const answers = await AssessmentAnswers.find({ attempt_id: attemptId });
  const totalMarksObtained = answers.reduce((sum, a) => {
    return sum + (parseFloat(a.marks_awarded) || 0);
  }, 0);

  const assessment = await Assessments.findById(attempt.assessment_id);
  const totalMarks = assessment.total_marks || 0;
  const percentage =
    totalMarks > 0
      ? ((totalMarksObtained / totalMarks) * 100).toFixed(2)
      : 0;
  const isPass =
    assessment.pass_marks !== null
      ? totalMarksObtained >= assessment.pass_marks
      : null;

  attempt.is_evaluated = true;
  attempt.evaluated_by = new mongoose.Types.ObjectId(evaluationData.evaluated_by);
  attempt.evaluated_at = new Date();
  attempt.marks_obtained = totalMarksObtained;
  attempt.percentage = parseFloat(percentage);
  attempt.is_pass = isPass;
  attempt.remarks = evaluationData.remarks || null;

  await attempt.save();
  return attempt;
};

module.exports = {
  startAttempt,
  submitAttempt,
  getAttemptById,
  getAttemptsByAssessment,
  getAttemptsByStudent,
  markAttemptEvaluated,
};
