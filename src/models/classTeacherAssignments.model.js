const mongoose = require("mongoose");

const classTeacherAssignmentsSchema = new mongoose.Schema(
  {
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeachersMaster",
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
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subjects_master",
      default: null,
    },
    role: {
      type: String,
      required: true,
      enum: [
        "class_teacher",
        "subject_teacher",
        "principal",
        "vice_principal",
        "lab_assistant",
      ],
    },
    academic_year: {
      type: String,
      required: true,
      description: "2025-26",
    },
    assigned_from: {
      type: Date,
      default: Date.now,
    },
    assigned_to: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive", "archived"],
      default: "active",
    },
    archived_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "class_teacher_assignments",
  }
);

// Indexes
classTeacherAssignmentsSchema.index({ teacher_id: 1 });
classTeacherAssignmentsSchema.index({ class_id: 1 });
classTeacherAssignmentsSchema.index({ section_id: 1 });
classTeacherAssignmentsSchema.index({ subject_id: 1 });
classTeacherAssignmentsSchema.index({ role: 1 });
classTeacherAssignmentsSchema.index({ academic_year: 1 });
classTeacherAssignmentsSchema.index({ status: 1 });

// Compound indexes for common queries
classTeacherAssignmentsSchema.index({ teacher_id: 1, academic_year: 1 });
classTeacherAssignmentsSchema.index({ class_id: 1, academic_year: 1 });
classTeacherAssignmentsSchema.index({ class_id: 1, section_id: 1, role: 1 });

module.exports = mongoose.model(
  "ClassTeacherAssignments",
  classTeacherAssignmentsSchema
);