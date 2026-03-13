const mongoose = require("mongoose");

const assessmentQuestionsSchema = new mongoose.Schema(
  {
    institute_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "institutes_master",
      required: true,
    },
    assessment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessments",
      required: true,
    },
    question_text: {
      type: String,
      required: true,
    },
    question_type: {
      type: String,
      enum: ["mcq", "short_answer"],
      required: true,
    },
    // For MCQ questions only
    options: {
      type: [
        {
          option_id: { type: String, required: true }, // A, B, C, D
          option_text: { type: String, required: true },
        },
      ],
      default: null,
    },
    // Correct answer(s) for MCQ only
    correct_options: {
      type: [String],
      default: null,
    },
    // For short_answer questions only
    correct_answer_text: {
      type: String,
      default: null,
    },
    marks: {
      type: Number,
      required: true,
    },
    hint: {
      type: String,
      default: null,
    },
    explanation: {
      type: String,
      default: null,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "assessment_questions",
  }
);

// Indexes
assessmentQuestionsSchema.index({ assessment_id: 1, order: 1 });

module.exports = mongoose.model("AssessmentQuestions", assessmentQuestionsSchema);
