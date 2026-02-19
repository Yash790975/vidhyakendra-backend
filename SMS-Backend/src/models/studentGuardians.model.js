const mongoose = require("mongoose");

const studentGuardiansSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentsMaster",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    relation: {
      type: String,
      required: true,
      enum: [
        "father",
        "mother",
        "guardian",
        "grandfather",
        "grandmother",
        "brother",
        "sister",
        "other",
      ],
    },
    mobile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: null,
    },
    occupation: {
      type: String,
      default: null,
    },
    is_primary: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "student_guardians",
  }
);

// Indexes
studentGuardiansSchema.index({ student_id: 1 });
studentGuardiansSchema.index({ relation: 1 });
studentGuardiansSchema.index({ is_primary: 1 });

// Compound index for getting primary guardian by student
studentGuardiansSchema.index({ student_id: 1, is_primary: 1 });

module.exports = mongoose.model("StudentGuardians", studentGuardiansSchema);