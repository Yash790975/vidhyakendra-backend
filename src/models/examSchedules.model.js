const mongoose = require("mongoose");

const examSchedulesSchema = new mongoose.Schema(
  {
    exam_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamsMaster",
      required: true,
    },
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassesMaster",
      required: true,
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
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subjects_master",
      required: true,
    },
    exam_date: {
      type: Date,
      required: true,
    },
    start_time: {
      type: String,
      default: null,
    },
    end_time: {
      type: String,
      default: null,
    },
    duration_minutes: {
      type: Number,
      default: null,
    },
    room_number: {
      type: String,
      default: null,
    },
    total_marks: {
      type: Number,
      required: true,
    },
    pass_marks: {
      type: Number,
      default: null,
    },
    theory_marks: {
      type: Number,
      default: null,
    },
    practical_marks: {
      type: Number,
      default: null,
    },
    invigilator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeachersMaster",
      default: null,
    },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  {
    timestamps: true,
    collection: "exam_schedules",
  }
);

// Indexes
examSchedulesSchema.index({ exam_id: 1, class_id: 1, subject_id: 1 });
examSchedulesSchema.index({ exam_date: 1 });

module.exports = mongoose.model("ExamSchedules", examSchedulesSchema);
