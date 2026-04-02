const mongoose = require("mongoose");

const studentAcademicMappingSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentsMaster",
      required: true,
    },
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassesMaster",
      default: null,
    },
    section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassSections",
      default: null,
      description: "For school - FK → class_sections._id",
    },
    batch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CoachingBatches",
      default: null,
      description: "For coaching - FK → coaching_batches._id",
    },
    mapping_type: {
      type: String,
      required: true,
      enum: ["school", "coaching"],
    },
    academic_year: {
      type: String,
      required: true,
      description: "2025-26",
    },
    roll_number: {
      type: String,
      default: null,
    },
    joined_at: {
      type: Date,
      default: Date.now,
    },
    left_at: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "promoted", "completed", "dropped", "repeated"],
      default: "active",
    },
  },
  {
    timestamps: true,
    collection: "student_academic_mapping",
  }
);

// Indexes
studentAcademicMappingSchema.index({ student_id: 1 });
studentAcademicMappingSchema.index({ class_id: 1 });
studentAcademicMappingSchema.index({ section_id: 1 });
studentAcademicMappingSchema.index({ batch_id: 1 });
studentAcademicMappingSchema.index({ mapping_type: 1 });
studentAcademicMappingSchema.index({ academic_year: 1 });
studentAcademicMappingSchema.index({ status: 1 });

// Compound indexes for common queries
studentAcademicMappingSchema.index({ student_id: 1, academic_year: 1 });
studentAcademicMappingSchema.index({ class_id: 1, academic_year: 1 });
studentAcademicMappingSchema.index({
  class_id: 1,
  section_id: 1,
  academic_year: 1,
});

module.exports = mongoose.model(
  "StudentAcademicMapping",
  studentAcademicMappingSchema
);