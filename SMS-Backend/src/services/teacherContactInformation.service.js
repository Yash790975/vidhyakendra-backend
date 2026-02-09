const TeacherContactInformation = require("../models/teacherContactInformation.model");
 const CustomError = require("../exceptions/CustomError");
 const statusCode = require("../enums/statusCode");
 const { sendOTPEmail } = require("./email.service");
     
 // ============= CONTACT INFORMATION =============
  
 const createContact = async (contactData) => {
   // Check if contact already exists
   const existing = await TeacherContactInformation.findOne({
     teacher_id: contactData.teacher_id,
   });
 
   if (existing) {
     throw new CustomError(
       "Contact information already exists for this teacher",
       statusCode.CONFLICT
     );
   }
 
   // Generate 6-digit OTP
   const otp = Math.floor(100000 + Math.random() * 900000).toString();
   const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
 
   const contact = new TeacherContactInformation({
     ...contactData,
     email_verified: false,
     mobile_verified: false,
     otp: otp,
     otp_expires_at: otpExpiresAt,
   });
 
   await contact.save();
 
   // Send OTP email
   try {
     await sendOTPEmail(contactData.email, otp, contactData.mobile);
   } catch (error) {
     console.error("Failed to send OTP email:", error);
     // Continue even if email fails
   }
 
   const result = contact.toObject();
   delete result.otp;
   delete result.otp_expires_at;
 
   return result;
 };
 
  
 const verifyOTP = async (email, otp) => {
  const contact = await TeacherContactInformation.findOne({ email });

  if (!contact) {
    throw new CustomError("Contact information not found for this email", statusCode.NOT_FOUND);
  }

  if (contact.email_verified && contact.mobile_verified) {
    throw new CustomError("Contact already verified", statusCode.BAD_REQUEST);
  }

  if (!contact.otp || !contact.otp_expires_at) {
    throw new CustomError("No OTP found. Please request a new one", statusCode.BAD_REQUEST);
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
  const contact = await TeacherContactInformation.findOne({ email });

  if (!contact) {
    throw new CustomError("Contact information not found for this email", statusCode.NOT_FOUND);
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


 const getContactByTeacherId = async (teacherId) => {
   const contact = await TeacherContactInformation.findOne({
     teacher_id: teacherId,
   }).select("-otp -otp_expires_at");
 
   if (!contact) {
     throw new CustomError("Contact information not found", statusCode.NOT_FOUND);
   }
 
   return contact;
 };
 
 const updateContact = async (teacherId, updateData) => {
   const contact = await TeacherContactInformation.findOne({
     teacher_id: teacherId,
   });
 
   if (!contact) {
     throw new CustomError("Contact information not found", statusCode.NOT_FOUND);
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

 // Get all teachers contacts (with optional filters)
const getAllTeachersContacts = async (filters = {}) => {
  const query = {};

  if (filters.teacher_id) query.teacher_id = filters.teacher_id;
  if (filters.email) query.email = filters.email;
  if (filters.mobile) query.mobile = filters.mobile;
  if (filters.email_verified !== undefined) query.email_verified = filters.email_verified;
  if (filters.mobile_verified !== undefined) query.mobile_verified = filters.mobile_verified;

  const contacts = await TeacherContactInformation
    .find(query)
    .populate("teacher_id", "full_name teacher_code")
    .select("-otp -otp_expires_at")
    .sort({ createdAt: -1 });

  return contacts;
};

// Delete contact by teacher id
const deleteContact = async (teacherId) => {
  const contact = await TeacherContactInformation.findOneAndDelete({
    teacher_id: teacherId,
  });
 
  if (!contact) {
    throw new CustomError("Contact information not found", statusCode.NOT_FOUND);
  }

  return { message: "Contact information deleted successfully" };
};

 
 module.exports = {
   // Contact Information
   createContact,
   verifyOTP,
   resendOTP,
   getContactByTeacherId,
   updateContact,
   getAllTeachersContacts,
   deleteContact 
 };


