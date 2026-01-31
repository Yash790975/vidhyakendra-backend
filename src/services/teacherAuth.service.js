
const TeacherAuth = require('../models/teacherAuth.model');
const Teacher = require('../models/teachersMaster.model'); 
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
  const key = Buffer.from(process.env.TEACHER_ENCRYPTION_KEY || process.env.ADMIN_ENCRYPTION_KEY, 'hex');
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');  
  
  return iv.toString('hex') + ':' + encrypted;
};

// Decrypt password
const decryptPassword = (encryptedPassword) => {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.TEACHER_ENCRYPTION_KEY || process.env.ADMIN_ENCRYPTION_KEY, 'hex');
  
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

// Create teacher auth
const createTeacherAuth = async (data) => { 
  // Check if teacher exists
  const teacher = await Teacher.findById(data.teacher_id);
  if (!teacher) {
    const error = new Error('Teacher not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  // Check if teacher auth already exists
  const existingAuth = await TeacherAuth.findOne({ 
    $or: [
      { teacher_id: data.teacher_id },
      { email: data.email }
    ]
  });
  
  if (existingAuth) {
    const error = new Error('Teacher auth already exists for this teacher or email');
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

  // Create teacher auth
  const teacherAuth = new TeacherAuth({
    teacher_id: data.teacher_id,
    email: data.email,  
    mobile: data.mobile,
    password_hash,
    password_key,
    is_first_login: true,
    status: data.status || 'active'
  });

  await teacherAuth.save();

  // Send email with credentials
  const emailSubject = 'Teacher Portal Credentials Created Successfully';
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to the Teacher Portal</h2>
      <p>Dear ${teacher.name || 'Teacher'},</p>
      <p>Your Teacher Portal credentials have been created successfully.</p>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
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
  const authObject = teacherAuth.toObject();
  delete authObject.password_hash;
  delete authObject.password_key;
  delete authObject.otp;
  delete authObject.otp_expiry;

  return authObject;
};

// Get all teacher auths
const getAllTeacherAuths = async () => {
  const teacherAuths = await TeacherAuth.find()
    .populate('teacher_id')
    .select('-password_hash -password_key -otp -otp_expiry');
  
  return teacherAuths;
};

// Get teacher auth by ID
const getTeacherAuthById = async (id) => {
  const teacherAuth = await TeacherAuth.findById(id)
    .populate('teacher_id')
    .select('-password_hash -password_key -otp -otp_expiry');
  
  return teacherAuth;
};

// Get teacher auth by teacher_id
const getTeacherAuthByTeacherId = async (teacherId) => {
  const teacherAuth = await TeacherAuth.findOne({ teacher_id: teacherId })
    .populate('teacher_id')
    .select('-password_hash -password_key -otp -otp_expiry');
  
  return teacherAuth;
};

// Update teacher auth
const updateTeacherAuth = async (id, data) => {
  const teacherAuth = await TeacherAuth.findById(id);
  if (!teacherAuth) {
    const error = new Error('Teacher auth not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  // If email is being updated, check for duplicates
  if (data.email && data.email !== teacherAuth.email) {
    const existingAuth = await TeacherAuth.findOne({ email: data.email });
    if (existingAuth) {
      const error = new Error('Teacher auth with this email already exists');
      error.statusCode = statusCode.CONFLICT;
      throw error;
    }
  }

  Object.assign(teacherAuth, data);
  await teacherAuth.save();

  const updatedAuth = await TeacherAuth.findById(id)
    .populate('teacher_id')
    .select('-password_hash -password_key -otp -otp_expiry');

  return updatedAuth;
};

// Delete teacher auth
const deleteTeacherAuth = async (id) => {
  const teacherAuth = await TeacherAuth.findByIdAndDelete(id);
  if (!teacherAuth) {
    const error = new Error('Teacher auth not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  return { message: 'Teacher auth deleted successfully' };
};

// Verify login
const verifyLogin = async (email, password) => {
  const teacherAuth = await TeacherAuth.findOne({ email })
    .populate('teacher_id');
  
  if (!teacherAuth) {
    const error = new Error('Invalid email or password');
    error.statusCode = statusCode.UNAUTHORIZED;
    throw error;
  }

  // Check if teacher auth is active
  if (teacherAuth.status !== 'active') {
    const error = new Error(`Account is ${teacherAuth.status}. Please contact administrator`);
    error.statusCode = statusCode.FORBIDDEN;
    throw error;
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, teacherAuth.password_hash);
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    error.statusCode = statusCode.UNAUTHORIZED;
    throw error;
  }

  // Update last login
  teacherAuth.last_login_at = new Date();
  await teacherAuth.save();

  const authObject = teacherAuth.toObject();
  delete authObject.password_hash;
  delete authObject.password_key;
  delete authObject.otp;
  delete authObject.otp_expiry;

  return {
    teacherAuth: authObject,
    is_first_login: teacherAuth.is_first_login
  };
};

// Request OTP
const requestOTP = async (email) => {
  const teacherAuth = await TeacherAuth.findOne({ email });
  
  if (!teacherAuth) {
    const error = new Error('Teacher not found with this email');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  // Generate OTP
  const otp = generateOTP();
  const otp_expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  teacherAuth.otp = otp;
  teacherAuth.otp_expiry = otp_expiry;
  await teacherAuth.save();

  // Get teacher name
  const teacher = await Teacher.findById(teacherAuth.teacher_id);
  const teacherName = teacher ? teacher.name : 'Teacher';

  // Send OTP email
  const emailSubject = 'OTP for Password Reset';
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset OTP</h2>
      <p>Dear ${teacherName},</p>
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
  const teacherAuth = await TeacherAuth.findOne({ email });
  
  if (!teacherAuth) {
    const error = new Error('Teacher not found with this email');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  if (!teacherAuth.otp || !teacherAuth.otp_expiry) {
    const error = new Error('No OTP found. Please request a new OTP');
    error.statusCode = statusCode.BAD_REQUEST;
    throw error;
  }

  if (new Date() > teacherAuth.otp_expiry) {
    const error = new Error('OTP has expired. Please request a new OTP');
    error.statusCode = statusCode.BAD_REQUEST;
    throw error;
  }

  if (teacherAuth.otp !== otp) {
    const error = new Error('Invalid OTP');
    error.statusCode = statusCode.UNAUTHORIZED;
    throw error;
  }

  return { message: 'OTP verified successfully', verified: true };
};

// Change password
const changePassword = async (email, old_password, new_password) => {
  const teacherAuth = await TeacherAuth.findOne({ email });
  
  if (!teacherAuth) {
    const error = new Error('Teacher not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  // Verify old password
  const isPasswordValid = await bcrypt.compare(old_password, teacherAuth.password_hash);
  if (!isPasswordValid) {
    const error = new Error('Old password is incorrect');
    error.statusCode = statusCode.UNAUTHORIZED;
    throw error;
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(new_password, salt);

  teacherAuth.password_hash = password_hash;
  teacherAuth.password_key = null;
  teacherAuth.is_first_login = false;
  await teacherAuth.save();

  // Get teacher name
  const teacher = await Teacher.findById(teacherAuth.teacher_id);
  const teacherName = teacher ? teacher.name : 'Teacher';

  // Send confirmation email
  const emailSubject = 'Password Changed Successfully';
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Changed</h2>
      <p>Dear ${teacherName},</p>
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
  const teacherAuth = await TeacherAuth.findOne({ email });
  
  if (!teacherAuth) {
    const error = new Error('Teacher not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  // Verify OTP
  if (!teacherAuth.otp || !teacherAuth.otp_expiry) {
    const error = new Error('No OTP found. Please request a new OTP');
    error.statusCode = statusCode.BAD_REQUEST;
    throw error;
  }

  if (new Date() > teacherAuth.otp_expiry) {
    const error = new Error('OTP has expired. Please request a new OTP');
    error.statusCode = statusCode.BAD_REQUEST;
    throw error;
  }

  if (teacherAuth.otp !== otp) {
    const error = new Error('Invalid OTP');
    error.statusCode = statusCode.UNAUTHORIZED;
    throw error;
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(new_password, salt);

  teacherAuth.password_hash = password_hash;
  teacherAuth.password_key = null;
  teacherAuth.otp = null;
  teacherAuth.otp_expiry = null;
  teacherAuth.is_first_login = false;
  await teacherAuth.save();

  // Get teacher name
  const teacher = await Teacher.findById(teacherAuth.teacher_id);
  const teacherName = teacher ? teacher.name : 'Teacher';

  // Send confirmation email
  const emailSubject = 'Password Reset Successfully';
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset</h2>
      <p>Dear ${teacherName},</p>
      <p>Your password has been reset successfully.</p>
      <p>You can now login with your new password.</p>
      <p>Best regards,<br/>School Management System Team</p>
    </div>
  `;

  await sendEmail(email, emailSubject, emailHtml);

  return { message: 'Password reset successfully' };
};

module.exports = {
  createTeacherAuth,
  getAllTeacherAuths,
  getTeacherAuthById,
  getTeacherAuthByTeacherId,
  updateTeacherAuth,
  deleteTeacherAuth,
  verifyLogin,
  requestOTP,
  verifyOTP,
  changePassword,
  resetPassword
};