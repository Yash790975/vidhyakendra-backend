const mongoose = require("mongoose");

const studentExamResultsSchema = new mongoose.Schema(
  {
    exam_schedule_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamSchedules",
      required: true,
    },
    student_id: {    
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentsMaster",
      required: true,
    },
    theory_marks_obtained: {
      type: mongoose.Schema.Types.Decimal128,
      default: null,
    },
    practical_marks_obtained: {
      type: mongoose.Schema.Types.Decimal128,
      default: null,
    },
    total_marks_obtained: {
      type: mongoose.Schema.Types.Decimal128,
      default: null,
    },
    total_marks: {
      type: Number,
      default: null,
    },
    percentage: {
      type: mongoose.Schema.Types.Decimal128,
      default: null,
    },
    grade: {
      type: String,
      default: null,
    },
    rank: {
      type: Number,
      default: null,
    },
    remarks: {
      type: String,
      default: null,
    },
    is_absent: {
      type: Boolean,
      default: null,
    },
    is_pass: {
      type: Boolean,
      default: null,
    },
    evaluated_by: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "evaluated_by_model",
      default: null,
    },
    evaluated_by_model: {
      type: String,
      enum: ["institute_admins", "TeachersMaster"],
      default: null,
    },
    evaluated_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "student_exam_results",
  }
);

// Indexes
studentExamResultsSchema.index({ exam_schedule_id: 1, student_id: 1 }, { unique: true });
studentExamResultsSchema.index({ student_id: 1 });


// Convert Decimal128 to Number in JSON response
function decimalTransform(doc, ret) {
  const decimalFields = [
    "theory_marks_obtained",
    "practical_marks_obtained",
    "total_marks_obtained",
    "percentage",
  ];

  decimalFields.forEach((field) => {
    if (ret[field] != null && ret[field].toString) {
      ret[field] = Number(ret[field].toString());
    }
  });

  return ret;
}

studentExamResultsSchema.set("toJSON", { transform: decimalTransform });
studentExamResultsSchema.set("toObject", { transform: decimalTransform });



module.exports = mongoose.model("StudentExamResults", studentExamResultsSchema);
