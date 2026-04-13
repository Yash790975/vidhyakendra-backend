const mongoose = require("mongoose");

const assessmentsSchema = new mongoose.Schema(
  {
    institute_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "institutes_master",
      required: true, 
    },
    institute_type: {                              
      type: String,
      enum: ["school", "coaching"],
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
    assessment_type: {
      type: String,
      enum: ["mcq", "short_answer", "mixed"],
      required: true,
    },
    // School context — null when institute_type is "coaching"
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassesMaster",
      default: null,                              
    },
    section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassSections",
      default: null,
    },
    // Coaching context — null when institute_type is "school"
    batch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CoachingBatches",
      default: null,
    },
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subjects_master",
      required: true,
    },
    academic_year: {
      type: String,
      required: true,
    },
    total_marks: { type: Number, default: null },
    pass_marks: { type: Number, default: null },
    duration_minutes: { type: Number, default: null },
    available_from: { type: Date, default: null },
    available_until: { type: Date, default: null },
    max_attempts: { type: Number, default: null },
    show_result_immediately: { type: Boolean, default: null },
    show_answer_key: { type: Boolean, default: null },
    status: {
      type: String,
      enum: ["draft", "published", "closed"],
      default: "draft",
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeachersMaster",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "assessments",
  }
);

// Indexes
assessmentsSchema.index({ institute_id: 1, institute_type: 1, status: 1 });
assessmentsSchema.index({ institute_id: 1, class_id: 1, subject_id: 1, status: 1 });
assessmentsSchema.index({ institute_id: 1, batch_id: 1, subject_id: 1, status: 1 }); 
assessmentsSchema.index({ created_by: 1, status: 1 });
assessmentsSchema.index({ available_from: 1, available_until: 1 });
assessmentsSchema.index({ batch_id: 1, status: 1 });                                 

module.exports = mongoose.model("Assessments", assessmentsSchema);
