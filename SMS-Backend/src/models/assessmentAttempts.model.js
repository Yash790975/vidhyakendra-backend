const mongoose = require("mongoose");

const assessmentAttemptsSchema = new mongoose.Schema(
  {
    institute_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "institutes_master",
      required: true,
    },
    assessment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessments",
      required: true,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentsMaster",
      required: true,
    },
    // Denormalised for fast section/batch-level queries
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassesMaster",
      default: null,
    },
    section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassSections",
      default: null,
    },
    batch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CoachingBatches",
      default: null,
    },
    attempt_number: {
      type: Number,
      required: true,
    },
    started_at: {
      type: Date,
      required: true,
    },
    submitted_at: {
      type: Date,
      default: null,
    },
    time_taken_seconds: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ["in_progress", "submitted", "auto_submitted", "abandoned"],
      required: true,
      default: "in_progress",
    },
    // Score details — filled after evaluation/auto-evaluation
    total_marks: {
      type: Number,
      default: null,
    },
    marks_obtained: {
      type: mongoose.Schema.Types.Decimal128,
      default: null,
    },
    percentage: {
      type: mongoose.Schema.Types.Decimal128,
      default: null,
    },
    grade: {
      type: String,
      default: null,
    },
    is_pass: {
      type: Boolean,
      default: null,
    },
    // For short_answer: teacher must manually evaluate
    is_evaluated: {
      type: Boolean,
      default: null,
    },
    evaluated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeachersMaster",
      default: null,
    },
    evaluated_at: {
      type: Date,
      default: null,
    },
    remarks: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "assessment_attempts",
  }
);

// Indexes
assessmentAttemptsSchema.index(
  { assessment_id: 1, student_id: 1, attempt_number: 1 },
  { unique: true }
);
assessmentAttemptsSchema.index({ institute_id: 1, assessment_id: 1, status: 1 });
assessmentAttemptsSchema.index({ institute_id: 1, section_id: 1, status: 1 });
assessmentAttemptsSchema.index({ institute_id: 1, batch_id: 1, status: 1 });
assessmentAttemptsSchema.index({ student_id: 1, status: 1 });

module.exports = mongoose.model("AssessmentAttempts", assessmentAttemptsSchema);
