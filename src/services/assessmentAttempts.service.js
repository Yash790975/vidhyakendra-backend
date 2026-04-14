const AssessmentAttempts = require("../models/assessmentAttempts.model");
const AssessmentAnswers = require("../models/assessmentAnswers.model");
const AssessmentQuestions = require("../models/assessmentQuestions.model");
const Assessments = require("../models/assessments.model");
const mongoose = require("mongoose"); 

const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");
const { formatAttemptFields } = require("../utils/dateFormatter");

const formatAttempt = (doc) => {
  const obj = doc.toObject ? doc.toObject() : doc;
  return formatAttemptFields(obj);
};

// Shared populate helper
const populateAttempt = (query) =>
  query
    .populate("institute_id", "institute_name institute_code")
    .populate("assessment_id", "title total_marks pass_marks show_result_immediately show_answer_key duration_minutes")
    .populate("student_id", "full_name roll_number")
    .populate("class_id", "class_name")
    .populate("section_id", "section_name")
    .populate("batch_id", "batch_name start_time end_time")
    .populate("evaluated_by", "full_name teacher_code");

const startAttempt = async (attemptData) => {
  const isCoaching = attemptData.institute_type === "coaching";

  const assessment = await Assessments.findById(attemptData.assessment_id);
  if (!assessment) {
    throw new CustomError("Assessment not found", statusCode.NOT_FOUND);
  }

  if (assessment.status !== "published") {
    throw new CustomError("Assessment is not available", statusCode.BAD_REQUEST);
  }

  //  Validate institute_type consistency between attempt and assessment
  if (assessment.institute_type !== attemptData.institute_type) {
    throw new CustomError(
      `institute_type mismatch: assessment is '${assessment.institute_type}' but attempt says '${attemptData.institute_type}'`,
      statusCode.BAD_REQUEST
    );
  }

  const now = new Date();
  if (assessment.available_from && now < assessment.available_from) {
    throw new CustomError("Assessment has not started yet", statusCode.BAD_REQUEST);
  }
  if (assessment.available_until && now > assessment.available_until) {
    throw new CustomError("Assessment has expired", statusCode.BAD_REQUEST);
  }

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
    institute_type: attemptData.institute_type,

    //  Coaching: batch_id set, class_id/section_id forced null
    //  School: class_id set, batch_id forced null
    class_id: isCoaching
      ? null
      : attemptData.class_id
        ? new mongoose.Types.ObjectId(attemptData.class_id)
        : null,
    section_id: isCoaching
      ? null
      : attemptData.section_id
        ? new mongoose.Types.ObjectId(attemptData.section_id)
        : null,
    batch_id: isCoaching
      ? new mongoose.Types.ObjectId(attemptData.batch_id)
      : null,

    assessment_id: new mongoose.Types.ObjectId(attemptData.assessment_id),
    student_id: new mongoose.Types.ObjectId(attemptData.student_id),
    attempt_number: completedAttempts + 1,
    started_at: new Date(),
    status: "in_progress",
  });

  await attempt.save();
  return formatAttempt(attempt);
};

const submitAttempt = async (attemptId) => {
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

  const submittedAt = new Date();
  const timeTakenSeconds = Math.round(
    (submittedAt.getTime() - new Date(attempt.started_at).getTime()) / 1000
  );

  const totalMarks = assessment.total_marks || 0;
  const marksObtained = mcqMarksObtained;
  const percentage =
    totalMarks > 0
      ? parseFloat(((marksObtained / totalMarks) * 100).toFixed(2))
      : 0;
  const isPass =
    assessment.pass_marks !== null ? marksObtained >= assessment.pass_marks : null;

  attempt.status = "submitted";
  attempt.submitted_at = submittedAt;
  attempt.time_taken_seconds = timeTakenSeconds;
  attempt.total_marks = totalMarks;
  attempt.marks_obtained = marksObtained;
  attempt.percentage = percentage;
  attempt.is_pass = isPass;
  attempt.is_evaluated = !hasShortAnswer;

  await attempt.save();

  return formatAttempt(await populateAttempt(AssessmentAttempts.findById(attemptId)));
};

const getAttemptById = async (attemptId) => {
  const attempt = await populateAttempt(AssessmentAttempts.findById(attemptId));
  if (!attempt) {
    throw new CustomError("Attempt not found", statusCode.NOT_FOUND);
  }
  return formatAttempt(attempt);
};

const getAttemptsByAssessment = async (assessmentId, filters = {}) => {
  const query = { assessment_id: assessmentId };

  if (filters.student_id)
    query.student_id = new mongoose.Types.ObjectId(filters.student_id);
  if (filters.status) query.status = filters.status;
  if (filters.section_id)
    query.section_id = new mongoose.Types.ObjectId(filters.section_id);
  if (filters.batch_id)
    query.batch_id = new mongoose.Types.ObjectId(filters.batch_id);

  const attempts = await populateAttempt(
    AssessmentAttempts.find(query).sort({ submitted_at: -1, started_at: -1 })
  );

  return attempts.map(formatAttempt);
};

const getAttemptsByStudent = async (studentId, filters = {}) => {
  const query = { student_id: studentId };

  if (filters.status) query.status = filters.status;
  if (filters.assessment_id)
    query.assessment_id = new mongoose.Types.ObjectId(filters.assessment_id);
  if (filters.institute_type)                                //  NEW optional filter
    query.institute_type = filters.institute_type;

  const attempts = await populateAttempt(
    AssessmentAttempts.find(query).sort({ started_at: -1 })
  );

  return attempts.map(formatAttempt);
};

const markAttemptEvaluated = async (attemptId, evaluationData) => {
  const attempt = await AssessmentAttempts.findById(attemptId);
  if (!attempt) {
    throw new CustomError("Attempt not found", statusCode.NOT_FOUND);
  }

  const answers = await AssessmentAnswers.find({ attempt_id: attemptId });
  const totalMarksObtained = answers.reduce(
    (sum, a) => sum + (parseFloat(a.marks_awarded) || 0),
    0
  );

  const assessment = await Assessments.findById(attempt.assessment_id);
  const totalMarks = assessment.total_marks || 0;
  const percentage =
    totalMarks > 0
      ? parseFloat(((totalMarksObtained / totalMarks) * 100).toFixed(2))
      : 0;
  const isPass =
    assessment.pass_marks !== null
      ? totalMarksObtained >= assessment.pass_marks
      : null;

  attempt.is_evaluated = true;
  attempt.evaluated_by = new mongoose.Types.ObjectId(evaluationData.evaluated_by);
  attempt.evaluated_at = new Date();
  attempt.marks_obtained = totalMarksObtained;
  attempt.percentage = percentage;
  attempt.is_pass = isPass;
  attempt.remarks = evaluationData.remarks || null;

  await attempt.save();

  return formatAttempt(await populateAttempt(AssessmentAttempts.findById(attemptId)));
};

module.exports = {
  startAttempt,
  submitAttempt,
  getAttemptById,
  getAttemptsByAssessment,
  getAttemptsByStudent,
  markAttemptEvaluated,
};

 