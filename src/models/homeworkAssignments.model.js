const mongoose = require("mongoose");

const homeworkAssignmentsSchema = new mongoose.Schema(
  {
    institute_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "institutes_master",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subjects_master",
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
    assigned_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeachersMaster",
      required: true,
      description: "Teacher ID", 
    },
    assigned_date: {
      type: Date,
      required: true,
    },
    due_date: {
      type: Date,
      required: true,
    },
    total_marks: {
      type: Number,
      default: null,
    },
    attachment_urls: {
      type: [String],
      default: null,
    },
    instructions: {
      type: String,
      default: null,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "closed", "archived"],
      default: "active",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "homework_assignments",
  }
);

// Indexes
homeworkAssignmentsSchema.index({ institute_id: 1, class_id: 1, due_date: -1 });
homeworkAssignmentsSchema.index({ assigned_by: 1, status: 1 });

module.exports = mongoose.model("HomeworkAssignments", homeworkAssignmentsSchema);
