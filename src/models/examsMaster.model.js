const mongoose = require("mongoose");

const examsMasterSchema = new mongoose.Schema(
  {
    institute_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "institutes_master",
      required: true,
    },
    exam_name: {
      type: String,
      required: true,
    },
    exam_code: {
      type: String,
      default: null,
    },
    exam_type: {
      type: String,
      enum: ["quarterly", "half_yearly", "annual", "unit_test", "mock", "entrance"],
      required: true,
    },
    academic_year: {
      type: String,
      required: true,
    },
    term: {
      type: String,
      default: null,
      description: "Term 1, Term 2",
    },
    start_date: {
      type: Date,
      default: null,
    },
    end_date: {
      type: Date,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    instructions: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["draft", "scheduled", "ongoing", "completed", "archived"],
      default: "draft",
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "created_by_model",
      default: null,
    },
    created_by_model: {
      type: String,
      enum: ["institute_admins", "TeachersMaster"],
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "exams_master",
  }
);

// Indexes
examsMasterSchema.index({ institute_id: 1, academic_year: 1 });
examsMasterSchema.index({ status: 1, start_date: 1 });

module.exports = mongoose.model("ExamsMaster", examsMasterSchema);
