const StudentContactInformation = require("../models/studentContactInformation.model");
const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");
const { sendOTPEmail } = require("./email.service"); 

// ============= CONTACT INFORMATION =============
    
const createContact = async (contactData) => {
  // If this is being set as primary, unset any existing primary contacts for this student
  if (contactData.is_primary) {
    await StudentContactInformation.updateMany(
      { student_id: contactData.student_id, is_primary: true },
      { $set: { is_primary: false } }
    );
  }

  // Generate 6-digit OTP only if email is provided
  let otp = null;
  let otpExpiresAt = null;

  if (contactData.email) {
    otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  }

  const contact = new StudentContactInformation({
    ...contactData,
    contact_type: contactData.contact_type || "student",
    email_verified: false,
    mobile_verified: false,
    is_primary: contactData.is_primary || false,
    otp: otp,
    otp_expires_at: otpExpiresAt,
  });

  await contact.save();

  // Send OTP email only if email is provided
  if (contactData.email && otp) {
    try {
      await sendOTPEmail(contactData.email, otp, contactData.mobile);
    } catch (error) {
      console.error("Failed to send OTP email:", error);
      // Continue even if email fails
    }
  }

  const result = contact.toObject();
  delete result.otp;
  delete result.otp_expires_at;

  return result;
};

const verifyOTP = async (email, otp) => {
  const contact = await StudentContactInformation.findOne({ email });

  if (!contact) {
    throw new CustomError(
      "Contact information not found for this email",
      statusCode.NOT_FOUND
    );
  }

  if (contact.email_verified && contact.mobile_verified) {
    throw new CustomError("Contact already verified", statusCode.BAD_REQUEST);
  }

  if (!contact.otp || !contact.otp_expires_at) {
    throw new CustomError(
      "No OTP found. Please request a new one",
      statusCode.BAD_REQUEST
    );
  }

  if (new Date() > contact.otp_expires_at) {
    throw new CustomError("OTP has expired", statusCode.BAD_REQUEST);
  }

  if (contact.otp !== otp) {
    throw new CustomError("Invalid OTP", statusCode.BAD_REQUEST);
  }

  // ✅ Verification success
  contact.email_verified = true;
  contact.mobile_verified = true;
  contact.otp = undefined;
  contact.otp_expires_at = undefined;

  await contact.save();

  const result = contact.toObject();
  delete result.otp;
  delete result.otp_expires_at;

  return result;
};

const resendOTP = async (email) => {
  const contact = await StudentContactInformation.findOne({ email });

  if (!contact) {
    throw new CustomError(
      "Contact information not found for this email",
      statusCode.NOT_FOUND
    );
  }

  if (contact.email_verified && contact.mobile_verified) {
    throw new CustomError("Contact already verified", statusCode.BAD_REQUEST);
  }

  // Generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  contact.otp = otp;
  contact.otp_expires_at = otpExpiresAt;

  await contact.save();

  // Send OTP email
  await sendOTPEmail(contact.email, otp, contact.mobile);

  return { message: "OTP resent successfully" };
};

const getContactByStudentId = async (studentId) => {
  const contact = await StudentContactInformation.findOne({
    student_id: studentId,
  })
  .populate("student_id", "full_name student_code")
  .select("-otp -otp_expires_at");

  if (!contact) {
    throw new CustomError(
      "Contact information not found",
      statusCode.NOT_FOUND
    );
  }

  return contact;
};

// Get all contacts for a student
const getAllContactsByStudentId = async (studentId) => {
  const contacts = await StudentContactInformation.find({
    student_id: studentId,
  })
    .populate("student_id", "full_name student_code")
    .select("-otp -otp_expires_at")
    .sort({ is_primary: -1, createdAt: -1 });

  return contacts;
};

// Get primary contact for a student
const getPrimaryContactByStudentId = async (studentId) => {
  const contact = await StudentContactInformation.findOne({
    student_id: studentId,
    is_primary: true,
  })
    .populate("student_id", "full_name student_code")
  .select("-otp -otp_expires_at");

  if (!contact) {
    throw new CustomError(
      "Primary contact information not found",
      statusCode.NOT_FOUND
    );
  }

  return contact;
};

const updateContact = async (contactId, updateData) => {
  const contact = await StudentContactInformation.findById(contactId);

  if (!contact) {
    throw new CustomError(
      "Contact information not found",
      statusCode.NOT_FOUND
    );
  }

  // If setting this contact as primary, unset other primary contacts for this student
  if (updateData.is_primary === true) {
    await StudentContactInformation.updateMany(
      {
        student_id: contact.student_id,
        _id: { $ne: contactId },
        is_primary: true,
      },
      { $set: { is_primary: false } }
    );
  }

  // If email or mobile is being updated, reset verification
  if (updateData.email && updateData.email !== contact.email) {
    contact.email_verified = false;
  }
  if (updateData.mobile && updateData.mobile !== contact.mobile) {
    contact.mobile_verified = false;
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      contact[key] = updateData[key];
    }
  });

  await contact.save();

  const result = contact.toObject();
  delete result.otp;
  delete result.otp_expires_at;

  return result;
};

// Get all students contacts (with optional filters)
const getAllStudentsContacts = async (filters = {}) => {
  const query = {};

  if (filters.student_id) query.student_id = filters.student_id;
  if (filters.contact_type) query.contact_type = filters.contact_type;
  if (filters.email) query.email = filters.email;
  if (filters.mobile) query.mobile = filters.mobile;
  if (filters.email_verified !== undefined)
    query.email_verified = filters.email_verified;
  if (filters.mobile_verified !== undefined)
    query.mobile_verified = filters.mobile_verified;
  if (filters.is_primary !== undefined) query.is_primary = filters.is_primary;

  const contacts = await StudentContactInformation.find(query)
    .populate("student_id", "full_name student_code gender  ")
    .select("-otp -otp_expires_at")
    .sort({ createdAt: -1 });
 
  return contacts;
};
 
// Delete contact by id
const deleteContact = async (contactId) => {
  const contact = await StudentContactInformation.findByIdAndDelete(contactId);

  if (!contact) {
    throw new CustomError(
      "Contact information not found",
      statusCode.NOT_FOUND
    );
  }

  return { message: "Contact information deleted successfully" };
};

module.exports = {
  // Contact Information
  createContact,
  verifyOTP,
  resendOTP,
  getContactByStudentId,
  getAllContactsByStudentId,
  getPrimaryContactByStudentId,
  updateContact,
  getAllStudentsContacts,
  deleteContact,
};

