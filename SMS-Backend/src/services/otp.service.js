const OTP = require('../models/otp.model');
const { sendOTPEmail } = require('./email.service');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const createAndSendOTP = async (mobile, email, otpType = 'mobile_verification') => {
  try {
    // Generate OTP
    const otp = generateOTP();

    // Delete any existing OTPs for this mobile number
    await OTP.deleteMany({ mobile, otp_type: otpType });

    // Create new OTP record
    const otpRecord = new OTP({
      mobile,
      otp,
      otp_type: otpType,
      expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    await otpRecord.save();

    // Send OTP via email
    await sendOTPEmail(email, otp, mobile);

    return {
      message: 'OTP sent successfully',
      otp_id: otpRecord._id,
    };
  } catch (error) {
    throw error;
  }
};

const verifyOTP = async (mobile, otp) => {
  try {
    // Find the OTP record
    const otpRecord = await OTP.findOne({
      mobile,
      otp,
      is_verified: false,
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      throw new Error('Invalid OTP');
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.expires_at) {
      throw new Error('OTP has expired');
    }

    // Mark OTP as verified
    otpRecord.is_verified = true;
    await otpRecord.save();

    return {
      verified: true,
      message: 'OTP verified successfully',
    };
  } catch (error) {
    throw error;
  }
};

const resendOTP = async (mobile, email, otpType = 'mobile_verification') => {
  try {
    // Check if there's a recent OTP sent (within last 1 minute)
    const recentOTP = await OTP.findOne({
      mobile,
      otp_type: otpType,
      createdAt: { $gte: new Date(Date.now() - 60 * 1000) },
    });

    if (recentOTP) {
      throw new Error('Please wait for 1 minute before requesting a new OTP');
    }

    // Create and send new OTP
    return await createAndSendOTP(mobile, email, otpType);
  } catch (error) {
    throw error;
  }
};

const deleteExpiredOTPs = async () => {
  try {
    const result = await OTP.deleteMany({
      expires_at: { $lt: new Date() },
    });
    console.log(`Deleted ${result.deletedCount} expired OTPs`);
    return result;
  } catch (error) {
    console.error('Error deleting expired OTPs:', error);
    throw error;
  }
};

module.exports = {
  generateOTP,
  createAndSendOTP,
  verifyOTP,
  resendOTP,
  deleteExpiredOTPs,
};