const mongoose = require("mongoose");

const teacherExperienceSchema = new mongoose.Schema(
  {
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
          ref: "TeachersMaster", 

      required: true, 
    }, 
    organization_name: { 
      type: String,
      required: true, 
    },
    role: {
      type: String,
    },
    responsibilities: {
      type: String, 
    },

    from_date: {
      type: Date,
    },
    to_date: {
      type: Date,
      default: null,
    },
    is_current: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "teacher_experience"
  }
);

teacherExperienceSchema.index({ teacher_id: 1 });
teacherExperienceSchema.index({ is_current: 1 });

module.exports = mongoose.model("TeacherExperience", teacherExperienceSchema);