const mongoose = require("mongoose");

const studentsMasterSchema = new mongoose.Schema(
  {
    institute_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "institutes_master",
      required: true,
    },
    student_code: {
      type: String,
      required: true,
      description: "Unique institute-level student code",
    },
    student_type: {
      type: String,
      required: true,
      enum: ["school", "coaching"],
    },
    full_name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
    date_of_birth: {
      type: Date,
      required: true,
    },
    blood_group: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive", "blocked", "archived"],
      default: "active",
    },
    archived_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "students_master",
  }
);

// Compound unique index
studentsMasterSchema.index(
  { institute_id: 1, student_code: 1 },
  { unique: true }
);

// Additional indexes
studentsMasterSchema.index({ status: 1 });
studentsMasterSchema.index({ student_type: 1 });

module.exports = mongoose.model("StudentsMaster", studentsMasterSchema);