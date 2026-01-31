const mongoose = require("mongoose");

const teachersMasterSchema = new mongoose.Schema(
  {
    institute_id: {
      type: mongoose.Schema.Types.ObjectId, 
      // ref: "Institute",     
      ref: "institutes_master",  
      required: true,  
    },      
    teacher_code: {  
      type: String, 
      required: true,
      description: "Unique institute-level teacher code",
    }, 
    teacher_type: {
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
    marital_status: {
      type: String,
      enum: ["single", "married", "divorced", "widowed"],
    },
    spouse_name: {
      type: String,
      default: null,
    },
    employment_type: {
      type: String,
      required: true,
      enum: ["full_time", "part_time", "contract", "visiting"],
    },
    joining_date: {
      type: Date,
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive", "blocked", "archived"],
      default: "active",
    },
    archived_at: {
      type: Date,
    },
    blood_group: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "teachers_master"
  }
);

// Compound unique index
teachersMasterSchema.index(
  { institute_id: 1, teacher_code: 1 },
  { unique: true }
);

// Additional indexes
teachersMasterSchema.index({ status: 1 });
teachersMasterSchema.index({ teacher_type: 1 }); 

module.exports = mongoose.model("TeachersMaster", teachersMasterSchema);