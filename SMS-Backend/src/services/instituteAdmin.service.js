// services/instituteAdmin.service.js
const InstituteAdmin = require('../models/instituteAdmin.model');
const InstituteMaster = require('../models/institutesMaster.model');       
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const statusCode = require('../enums/statusCode');  
// Nodemailer transporter configuration 
const createTransporter = () => { 
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST, 
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Generate random 8-digit password
const generateTemporaryPassword = () => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Encrypt password using AES-256
const encryptPassword = (password) => {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.ADMIN_ENCRYPTION_KEY, 'hex');
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;  
};

// Decrypt password
const decryptPassword = (encryptedPassword) => {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.ADMIN_ENCRYPTION_KEY, 'hex');
  
  const parts = encryptedPassword.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

// Send email
const sendEmail = async (to, subject, html) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"School Management System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  };
  
  await transporter.sendMail(mailOptions);
};

// Create admin
const createAdmin = async (data) => {
  // Check if institute exists
  const institute = await InstituteMaster.findById(data.institute_id);
  if (!institute) {
    const error = new Error('Institute not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  // Check if admin already exists with this email
  const existingAdmin = await InstituteAdmin.findOne({ email: data.email });
  if (existingAdmin) {
    const error = new Error('Admin with this email already exists');
    error.statusCode = statusCode.CONFLICT;
    throw error;
  }

  // Generate temporary password
  const temporaryPassword = generateTemporaryPassword();
  
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(temporaryPassword, salt);
  
  // Encrypt temporary password for password_key
  const password_key = encryptPassword(temporaryPassword);

  // Create admin
  const admin = new InstituteAdmin({
    institute_id: data.institute_id,
    name: data.name,
    email: data.email,
    mobile: data.mobile,
    password_hash,
    password_key,
    is_first_login: true,
    status: data.status || 'active'
  });

  await admin.save();

  // Send email with credentials
  const emailSubject = 'Admin Panel Credentials Created Successfully';
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to ${institute.institute_name}</h2>
      <p>Dear ${data.name},</p>
      <p>Your Admin Panel credentials have been created successfully.</p>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Institute Type:</strong> ${institute.institute_type}</p>
        <p><strong>Username (Email):</strong> ${data.email}</p>
        <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
      </div>
      <p style="color: #d9534f;"><strong>Important:</strong> This is a temporary password. You will be required to change it upon your first login.</p>
      <p>Please keep these credentials secure and do not share them with anyone.</p>
      <p>Best regards,<br/>School Management System Team</p>
    </div>
  `;

  await sendEmail(data.email, emailSubject, emailHtml);

  // Remove sensitive data before returning
  const adminObject = admin.toObject();
  delete adminObject.password_hash;
  delete adminObject.password_key;
  delete adminObject.otp;
  delete adminObject.otp_expiry;

  return adminObject;
};

// Get all admins
const getAllAdmins = async () => {
  const admins = await InstituteAdmin.find()
    .populate('institute_id', 'institute_code institute_name institute_type status')
    .select('-password_hash -password_key -otp -otp_expiry');
  
  return admins;
};

// Get admin by ID
const getAdminById = async (id) => {
  const admin = await InstituteAdmin.findById(id)
    .populate('institute_id', 'institute_code institute_name institute_type status')
    .select('-password_hash -password_key -otp -otp_expiry');
  
  return admin;   
};

const getAdminByInstituteId = async (instituteId) => {
  const admin = await InstituteAdmin.findOne({ institute_id: instituteId })
    .populate('institute_id', 'institute_code institute_name institute_type status')
    .select('-password_hash -password_key -otp -otp_expiry');
  return admin;   
};

// Update admin
const updateAdmin = async (id, data) => {
  const admin = await InstituteAdmin.findById(id);
  if (!admin) {
    const error = new Error('Admin not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  // If email is being updated, check for duplicates
  if (data.email && data.email !== admin.email) {
    const existingAdmin = await InstituteAdmin.findOne({ email: data.email });
    if (existingAdmin) {
      const error = new Error('Admin with this email already exists');
      error.statusCode = statusCode.CONFLICT;
      throw error;
    }
  }

  Object.assign(admin, data);
  await admin.save();

  const updatedAdmin = await InstituteAdmin.findById(id)
    .populate('institute_id', 'institute_code institute_name institute_type status')
    .select('-password_hash -password_key -otp -otp_expiry');

  return updatedAdmin;
};

// Delete admin
const deleteAdmin = async (id) => {
  const admin = await InstituteAdmin.findByIdAndDelete(id);
  if (!admin) {
    const error = new Error('Admin not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  return { message: 'Admin deleted successfully' };
};
 
// Verify login
const verifyLogin = async (email, password) => {
  const admin = await InstituteAdmin.findOne({ email }).populate('institute_id', 'institute_code institute_name institute_type status');
  
  if (!admin) {
    const error = new Error('Invalid email or password');
    error.statusCode = statusCode.UNAUTHORIZED;
    throw error;
  }

  // Check if admin is active
  if (admin.status !== 'active') {
    const error = new Error(`Account is ${admin.status}. Please contact administrator`);
    error.statusCode = statusCode.FORBIDDEN;
    throw error;
  }

  

// ✅ First login handling
//   if (admin.is_first_login === true) {
//     admin.is_first_login = false;
//   }


  if (admin.institute_id.status !== 'active') {
    const error = new Error('Institute is not active. Please contact administrator');
    error.statusCode = statusCode.FORBIDDEN;
    throw error;
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    error.statusCode = statusCode.UNAUTHORIZED;
    throw error;
  } 

  // Update last login
  admin.last_login_at = new Date();
  await admin.save();

  const adminObject = admin.toObject();
  delete adminObject.password_hash;
  delete adminObject.password_key;
  delete adminObject.otp;
  delete adminObject.otp_expiry;

  return {
    admin: adminObject,
    is_first_login: admin.is_first_login,
    institute_type: admin.institute_id.institute_type
  };
};

// Request OTP
const requestOTP = async (email) => {
  const admin = await InstituteAdmin.findOne({ email });
  
  if (!admin) {
    const error = new Error('Admin not found with this email');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  // Generate OTP
  const otp = generateOTP();
  const otp_expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  admin.otp = otp;
  admin.otp_expiry = otp_expiry;
  await admin.save();

  // Send OTP email
  const emailSubject = 'OTP for Password Reset';
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset OTP</h2>
      <p>Dear ${admin.name},</p>
      <p>You have requested to reset your password. Please use the following OTP to proceed:</p>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;">
        <h1 style="color: #007bff; margin: 0; letter-spacing: 5px;">${otp}</h1>
      </div>
      <p><strong>This OTP is valid for 10 minutes.</strong></p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Best regards,<br/>School Management System Team</p>
    </div>
  `;

  await sendEmail(email, emailSubject, emailHtml);

  return { message: 'OTP sent successfully to your email' };
};

// Verify OTP
const verifyOTP = async (email, otp) => {
  const admin = await InstituteAdmin.findOne({ email });
  
  if (!admin) {
    const error = new Error('Admin not found with this email');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  if (!admin.otp || !admin.otp_expiry) {
    const error = new Error('No OTP found. Please request a new OTP');
    error.statusCode = statusCode.BAD_REQUEST;
    throw error;
  }

  if (new Date() > admin.otp_expiry) {
    const error = new Error('OTP has expired. Please request a new OTP');
    error.statusCode = statusCode.BAD_REQUEST;
    throw error;
  }

  if (admin.otp !== otp) {
    const error = new Error('Invalid OTP');
    error.statusCode = statusCode.UNAUTHORIZED;
    throw error;
  }

  return { message: 'OTP verified successfully', verified: true };
};

// Change password
const changePassword = async (email, old_password, new_password) => {
  const admin = await InstituteAdmin.findOne({ email });
  
  if (!admin) {
    const error = new Error('Admin not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  // Verify old password
  const isPasswordValid = await bcrypt.compare(old_password, admin.password_hash);
  if (!isPasswordValid) {
    const error = new Error('Old password is incorrect');
    error.statusCode = statusCode.UNAUTHORIZED;
    throw error;
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(new_password, salt);

  admin.password_hash = password_hash;
  admin.password_key = null;
  admin.is_first_login = false;
  await admin.save();

  // Send confirmation email
  const emailSubject = 'Password Changed Successfully';
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Changed</h2>
      <p>Dear ${admin.name},</p>
      <p>Your password has been changed successfully.</p>
      <p>If you did not make this change, please contact support immediately.</p>
      <p>Best regards,<br/>School Management System Team</p>
    </div>
  `;

  await sendEmail(email, emailSubject, emailHtml);

  return { message: 'Password changed successfully' };
};

// Reset password (with OTP)
const resetPassword = async (email, otp, new_password) => {
  const admin = await InstituteAdmin.findOne({ email });
  
  if (!admin) {
    const error = new Error('Admin not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  // Verify OTP
  if (!admin.otp || !admin.otp_expiry) {
    const error = new Error('No OTP found. Please request a new OTP');
    error.statusCode = statusCode.BAD_REQUEST;
    throw error;
  }

  if (new Date() > admin.otp_expiry) {
    const error = new Error('OTP has expired. Please request a new OTP');
    error.statusCode = statusCode.BAD_REQUEST;
    throw error;
  }

  if (admin.otp !== otp) {
    const error = new Error('Invalid OTP');
    error.statusCode = statusCode.UNAUTHORIZED;
    throw error;
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(new_password, salt);

  admin.password_hash = password_hash;
  admin.password_key = null;
  admin.otp = null;
  admin.otp_expiry = null;
  admin.is_first_login = false;
  await admin.save();

  // Send confirmation email
  const emailSubject = 'Password Reset Successfully';
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset</h2>
      <p>Dear ${admin.name},</p>
      <p>Your password has been reset successfully.</p>
      <p>You can now login with your new password.</p>
      <p>Best regards,<br/>School Management System Team</p>
    </div>
  `;

  await sendEmail(email, emailSubject, emailHtml);

  return { message: 'Password reset successfully' };
};

// Get admins by institute type (school or coaching)
const getAdminsByInstituteType = async (type) => {
  const admins = await InstituteAdmin.aggregate([
    {
      $lookup: {
        from: 'institutes_master', 
        localField: 'institute_id',
        foreignField: '_id',
        as: 'institute'
      }
    },
    { $unwind: '$institute' },
    { $match: { 'institute.institute_type': type } },
    {
      $project: {
        password_hash: 0,
        password_key: 0,
        otp: 0, 
        otp_expiry: 0
      }
    }
  ]);

  return admins;
};

module.exports = {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  verifyLogin,
  requestOTP,
  verifyOTP,
  changePassword,
  resetPassword,
  getAdminsByInstituteType,
  getAdminByInstituteId
};