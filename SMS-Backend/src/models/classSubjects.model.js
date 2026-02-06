const mongoose = require("mongoose");

const classSubjectsSchema = new mongoose.Schema(
  {
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassesMaster",
      required: true,
    },
    subject_id: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "subjects_master",
      required: true,
    },
    is_compulsory: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "class_subjects",
  }
);

// Compound unique index
classSubjectsSchema.index(
  { class_id: 1, subject_id: 1 },
  { unique: true }
);

// Additional indexes
classSubjectsSchema.index({ class_id: 1 });
classSubjectsSchema.index({ subject_id: 1 });

module.exports = mongoose.model("ClassSubjects", classSubjectsSchema);