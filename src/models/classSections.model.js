const mongoose = require("mongoose");

const classSectionsSchema = new mongoose.Schema(
  {
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassesMaster",
      required: true,
    },
    section_name: {
      type: String,
      required: true,
      description: "A, B, C",
    },
    class_teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeachersMaster",
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
    collection: "class_sections",
  }
);

// Compound unique index
classSectionsSchema.index(
  { class_id: 1, section_name: 1 },
  { unique: true }
);

// Additional indexes
classSectionsSchema.index({ status: 1 });
classSectionsSchema.index({ class_teacher_id: 1 });

module.exports = mongoose.model("ClassSections", classSectionsSchema);