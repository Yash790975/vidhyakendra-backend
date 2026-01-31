const mongoose = require("mongoose");

const teacherContactInformationSchema = new mongoose.Schema(
  {
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      // ref: "teachers_master", 
      ref: "TeachersMaster",  
      required: true,
      unique: true,
    },
    mobile: {
      type: String, 
      required: true, 
    },
    email: {
      type: String,
      required: true,
    },
    alternate_mobile: {
      type: String,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    mobile_verified: {
      type: Boolean,
      default: false,
    },
    // OTP fields for verification
    otp: {
      type: String,
    },
    otp_expires_at: {
      type: Date,
    },
  }, 
  {
    timestamps: true,
    collection: "teacher_contact_information"
  }
);

teacherContactInformationSchema.index({ teacher_id: 1 });
teacherContactInformationSchema.index({ email: 1 });

module.exports = mongoose.model(
  "TeacherContactInformation",
  teacherContactInformationSchema
);