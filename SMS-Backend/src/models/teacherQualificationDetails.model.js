const mongoose = require("mongoose");

const teacherQualificationDetailsSchema = new mongoose.Schema(
  {
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
    ref: "TeachersMaster", 
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
    },
    file_url: {
      type: String,
      required: true,
    },
    institute_name: {
      type: String,
    },
    passing_year: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: "teacher_qualification_details"
  }
);

teacherQualificationDetailsSchema.index({ teacher_id: 1 });

module.exports = mongoose.model(
  "TeacherQualificationDetails",
  teacherQualificationDetailsSchema
);