const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number'],
    },
    otp: {
      type: String,
      required: [true, 'OTP is required'],
    },
    otp_type: {
      type: String,
      enum: ['mobile_verification', 'login', 'password_reset'],
      default: 'mobile_verification',
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    expires_at: {
      type: Date,
      required: true,
      default: function() {
        return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
      }
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
otpSchema.index({ mobile: 1 });
otpSchema.index({ expires_at: 1 });
otpSchema.index({ is_verified: 1 });

// Auto-delete expired OTPs after 15 minutes
otpSchema.index({ expires_at: 1 }, { expireAfterSeconds: 900 });

// Transform to include virtuals
otpSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    return ret;
  }
});

otpSchema.set('toObject', { virtuals: true });

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;