const mongoose = require("mongoose");

const homeworkSubmissionsSchema = new mongoose.Schema(
  {
    homework_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HomeworkAssignments",
      required: true,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentsMaster",
      required: true,
    },
    submission_date: {
      type: Date,
      default: null,
    },
    submission_text: {
      type: String,
      default: null,
    },
    attachment_urls: {
      type: [String],
      default: null,
    },
    marks_obtained: {
      type: mongoose.Schema.Types.Decimal128,
      default: null,
    },
    feedback: {
      type: String,
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
    status: {
      type: String,
      enum: ["pending", "submitted", "evaluated", "late_submission"],
      default: "pending",
      required: true,
    },
    is_late: {
      type: Boolean,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "homework_submissions",
  }
);

// Indexes
homeworkSubmissionsSchema.index({ homework_id: 1, student_id: 1 }, { unique: true });
homeworkSubmissionsSchema.index({ student_id: 1, status: 1 });

module.exports = mongoose.model("HomeworkSubmissions", homeworkSubmissionsSchema);
