const mongoose = require("mongoose");

const studentContactInformationSchema = new mongoose.Schema(
  {
    student_id: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentsMaster",
      required: true,
    },
    contact_type: {
      type: String,
      enum: ["student", "father", "mother", "guardian"],
      default: "student",
    },
    mobile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: null,
    },
    alternate_mobile: {
      type: String,
      default: null,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    mobile_verified: {
      type: Boolean,
      default: false,
    },
    is_primary: {
      type: Boolean,
      default: false,
      description: "Primary contact for alerts, OTP, notices",
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
    collection: "student_contact_information",
  }
);

studentContactInformationSchema.index({ student_id: 1 });
studentContactInformationSchema.index({ email: 1 });
studentContactInformationSchema.index({ mobile: 1 });
studentContactInformationSchema.index({ contact_type: 1 });
studentContactInformationSchema.index({ is_primary: 1 });

// Compound index for getting primary contact by student
studentContactInformationSchema.index({ student_id: 1, is_primary: 1 });

module.exports = mongoose.model(
  "StudentContactInformation",
  studentContactInformationSchema
);


