const mongoose = require("mongoose");

const assessmentAnswersSchema = new mongoose.Schema(
  {
    institute_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "institutes_master",
      required: true,
    },
    attempt_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssessmentAttempts",
      required: true,
    },
    assessment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessments",
      required: true,
    },
    question_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssessmentQuestions",
      required: true,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentsMaster",
      required: true,
    },
    // What the student selected / typed
    selected_options: {
      type: [String],
      default: null,
    },
    answer_text: {
      type: String,
      default: null,
    },
    is_skipped: {
      type: Boolean,
      default: null,
    },
    // Auto-evaluation result (filled on submission for MCQ)
    is_correct: {
      type: Boolean,
      default: null,
    },
    marks_awarded: {
      type: mongoose.Schema.Types.Decimal128,
      default: null,
    },
    // Teacher evaluation (for short_answer only)
    teacher_marks: {
      type: mongoose.Schema.Types.Decimal128,
      default: null,
    },
    teacher_feedback: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "assessment_answers",
  }
);

// Indexes
assessmentAnswersSchema.index(
  { attempt_id: 1, question_id: 1 },
  { unique: true }
);
assessmentAnswersSchema.index({ assessment_id: 1, student_id: 1 });
assessmentAnswersSchema.index({ attempt_id: 1 });

module.exports = mongoose.model("AssessmentAnswers", assessmentAnswersSchema);
