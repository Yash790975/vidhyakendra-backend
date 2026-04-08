const StudentAuth = require('../models/studentAuth.model');
const Student = require('../models/studentsMaster.model'); 
const StudentContactInformation = require('../models/studentContactInformation.model');
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
  const key = Buffer.from(process.env.STUDENT_ENCRYPTION_KEY || process.env.ADMIN_ENCRYPTION_KEY, 'hex');
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');  
  
  return iv.toString('hex') + ':' + encrypted;
};

// Decrypt password
const decryptPassword = (encryptedPassword) => {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.STUDENT_ENCRYPTION_KEY || process.env.ADMIN_ENCRYPTION_KEY, 'hex');
  
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

// Get primary email for student
const getPrimaryEmail = async (studentId) => {
  const primaryContact = await StudentContactInformation.findOne({
    student_id: studentId,
    is_primary: true
  });

  if (!primaryContact || !primaryContact.email) {
    const error = new Error('No primary email found for this student');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  return primaryContact.email;
};

// Create student auth
const createStudentAuth = async (data) => { 
  // Check if student exists
  const student = await Student.findById(data.student_id);
  if (!student) {
    const error = new Error('Student not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  // Check if student auth already exists
  const existingAuth = await StudentAuth.findOne({ 
    $or: [
      { student_id: data.student_id },
      { username: student.student_code }
    ]
  });
  
  if (existingAuth) {
    const error = new Error('Student auth already exists for this student');
    error.statusCode = statusCode.CONFLICT;
    throw error;
  }

  // Get primary email for the student
  const primaryEmail = await getPrimaryEmail(data.student_id);

  // Generate temporary password
  const temporaryPassword = generateTemporaryPassword();
  
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(temporaryPassword, salt);
  
  // Encrypt temporary password for password_key
  const password_key = encryptPassword(temporaryPassword); 

  // Create student auth
  const studentAuth = new StudentAuth({
    student_id: data.student_id,
    username: student.student_code,
    password_hash,
    password_key,
    is_first_login: true,
    status: data.status || 'active'
  });

  await studentAuth.save();

  // Send email with credentials
  const emailSubject = 'Student Portal Credentials Created Successfully';
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to the Student Portal</h2>
      <p>Dear ${student.full_name || 'Student'},</p>
      <p>Your Student Portal credentials have been created successfully.</p>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Username:</strong> ${student.student_code}</p>
        <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
      </div>
      <p style="color: #d9534f;"><strong>Important:</strong> This is a temporary password. You will be required to change it upon your first login.</p>
      <p>Please keep these credentials secure and do not share them with anyone.</p>
      <p>Best regards,<br/>School Management System Team</p>
    </div>
  `;

  await sendEmail(primaryEmail, emailSubject, emailHtml);

  // Remove sensitive data before returning
  const authObject = studentAuth.toObject();
  delete authObject.password_hash;
  delete authObject.password_key;
  delete authObject.otp;
  delete authObject.otp_expiry;

  return authObject;
};

// Get all student auths
const getAllStudentAuths = async () => {
  const StudentAcademicMapping = require('../models/studentAcademicMapping.model');
  
  const studentAuths = await StudentAuth.find()
    // .populate('student_id')
    .populate({
      path: 'student_id',
      populate: {
        path: 'institute_id',
        select: 'institute_name institute_code institute_type status'
      }
    })
    .select('-password_hash -password_key -otp -otp_expiry')
    .lean();
  
  // Fetch academic mapping for each student
  for (let auth of studentAuths) {
    if (auth.student_id) {
      const activeMapping = await StudentAcademicMapping.findOne({
        student_id: auth.student_id._id,
        status: 'active'
      })
        
        .populate('class_id', 'class_name class_type class_level academic_year status')
        .populate('section_id', 'section_name status')
        .populate('batch_id', 'batch_name start_time end_time')
        .lean();
      
      if (activeMapping) {
        auth.student_id.class_id = activeMapping.class_id;
        auth.student_id.section_id = activeMapping.section_id;
        auth.student_id.batch_id = activeMapping.batch_id;
        auth.student_id.academic_year = activeMapping.academic_year;
        auth.student_id.roll_number = activeMapping.roll_number;
        auth.student_id.mapping_type = activeMapping.mapping_type;
      }
    }
  }
  
  return studentAuths;
};

// Get student auth by ID
const getStudentAuthById = async (id) => {
  const StudentAcademicMapping = require('../models/studentAcademicMapping.model');
  
  const studentAuth = await StudentAuth.findById(id)
    // .populate('student_id')
    .populate({ 
      path: 'student_id',
      populate: {
        path: 'institute_id',
        select: 'institute_name institute_code institute_type status'
      }
    })
    .select('-password_hash -password_key -otp -otp_expiry')
    .lean();
  
  if (studentAuth && studentAuth.student_id) {
    const activeMapping = await StudentAcademicMapping.findOne({
      student_id: studentAuth.student_id._id,
      status: 'active'
    })
      .populate('class_id', 'class_name class_type class_level academic_year status')
      .populate('section_id', 'section_name status')
      .populate('batch_id', 'batch_name start_time end_time')
      .lean();
    
    if (activeMapping) {
      studentAuth.student_id.class_id = activeMapping.class_id;
      studentAuth.student_id.section_id = activeMapping.section_id;
      studentAuth.student_id.batch_id = activeMapping.batch_id;
      studentAuth.student_id.academic_year = activeMapping.academic_year;
      studentAuth.student_id.roll_number = activeMapping.roll_number;
      studentAuth.student_id.mapping_type = activeMapping.mapping_type;
    }
  }
  
  return studentAuth;
};

// Get student auth by student_id
const getStudentAuthByStudentId = async (studentId) => {
  const StudentAcademicMapping = require('../models/studentAcademicMapping.model');
  
  const studentAuth = await StudentAuth.findOne({ student_id: studentId })
    // .populate('student_id')
    .populate({
      path: 'student_id',
      populate: {
        path: 'institute_id',
        select: 'institute_name institute_code institute_type status'
      }
    })
    .select('-password_hash -password_key -otp -otp_expiry')
    .lean();
  
  if (studentAuth && studentAuth.student_id) {
    const activeMapping = await StudentAcademicMapping.findOne({
      student_id: studentAuth.student_id._id,
      status: 'active'
    })
      .populate('class_id', 'class_name class_type class_level academic_year status')
      .populate('section_id', 'section_name status')
      .populate('batch_id', 'batch_name start_time end_time')
      .lean();
    
    if (activeMapping) {
      studentAuth.student_id.class_id = activeMapping.class_id;
      studentAuth.student_id.section_id = activeMapping.section_id;
      studentAuth.student_id.batch_id = activeMapping.batch_id;
      studentAuth.student_id.academic_year = activeMapping.academic_year;
      studentAuth.student_id.roll_number = activeMapping.roll_number;
      studentAuth.student_id.mapping_type = activeMapping.mapping_type;
    }
  }
  
  return studentAuth;
};

// Get student auth by username
const getStudentAuthByUsername = async (username) => {
  const StudentAcademicMapping = require('../models/studentAcademicMapping.model');
  
  const studentAuth = await StudentAuth.findOne({ username: username })
    // .populate('student_id')
    .populate({
      path: 'student_id',
      populate: {
        path: 'institute_id',
        select: 'institute_name institute_code institute_type status'
      }
    })
    .select('-password_hash -password_key -otp -otp_expiry')
    .lean();
  
  if (studentAuth && studentAuth.student_id) {
    const activeMapping = await StudentAcademicMapping.findOne({
      student_id: studentAuth.student_id._id,
      status: 'active'
    })
      .populate('class_id', 'class_name class_type class_level academic_year status')
      .populate('section_id', 'section_name status')
      .populate('batch_id', 'batch_name start_time end_time')
      .lean();
    
    if (activeMapping) {
      studentAuth.student_id.class_id = activeMapping.class_id;
      studentAuth.student_id.section_id = activeMapping.section_id;
      studentAuth.student_id.batch_id = activeMapping.batch_id;
      studentAuth.student_id.academic_year = activeMapping.academic_year;
      studentAuth.student_id.roll_number = activeMapping.roll_number;
      studentAuth.student_id.mapping_type = activeMapping.mapping_type;
    }
  }
  
  return studentAuth;
};

// Update student auth
const updateStudentAuth = async (id, data) => {
  const StudentAcademicMapping = require('../models/studentAcademicMapping.model');
  
  const studentAuth = await StudentAuth.findById(id);
  if (!studentAuth) {
    const error = new Error('Student auth not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  Object.assign(studentAuth, data);
  await studentAuth.save();

  const updatedAuth = await StudentAuth.findById(id)
    // .populate('student_id')
    .populate({
      path: 'student_id',
      populate: {
        path: 'institute_id',
        select: 'institute_name institute_code institute_type status'
      }
    })
    .select('-password_hash -password_key -otp -otp_expiry')
    .lean();

  if (updatedAuth && updatedAuth.student_id) {
    const activeMapping = await StudentAcademicMapping.findOne({
      student_id: updatedAuth.student_id._id,
      status: 'active'
    })
      .populate('class_id', 'class_name class_type class_level academic_year status')
      .populate('section_id', 'section_name status')
      .populate('batch_id', 'batch_name start_time end_time')
      .lean();
    
    if (activeMapping) {
      updatedAuth.student_id.class_id = activeMapping.class_id;
      updatedAuth.student_id.section_id = activeMapping.section_id;
      updatedAuth.student_id.batch_id = activeMapping.batch_id;
      updatedAuth.student_id.academic_year = activeMapping.academic_year;
      updatedAuth.student_id.roll_number = activeMapping.roll_number;
      updatedAuth.student_id.mapping_type = activeMapping.mapping_type;
    }
  }

  return updatedAuth;
};

// Delete student auth
const deleteStudentAuth = async (id) => {
  const studentAuth = await StudentAuth.findByIdAndDelete(id);
  if (!studentAuth) {
    const error = new Error('Student auth not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  return { message: 'Student auth deleted successfully' };
};

// Verify login
// Verify login
const verifyLogin = async (username, password, login_type) => {
  const StudentAcademicMapping = require('../models/studentAcademicMapping.model');
  
  const studentAuth = await StudentAuth.findOne({ username })
    .populate({
      path: 'student_id',
      populate: {
        path: 'institute_id',
        select: 'institute_name institute_code institute_type status'
      }
    });

  if (!studentAuth) {
    const error = new Error('Invalid username or password');
    error.statusCode = statusCode.UNAUTHORIZED;
    throw error;
  }

  // Check if student auth is active
  if (studentAuth.status !== 'active') {
    const error = new Error(`Account is ${studentAuth.status}. Please contact administrator`);
    error.statusCode = statusCode.FORBIDDEN;
    throw error;
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, studentAuth.password_hash);
  if (!isPasswordValid) {
    const error = new Error('Invalid username or password');
    error.statusCode = statusCode.UNAUTHORIZED;
    throw error;
  }

  // ✅ NEW: Validate institute_type against login_type
  if (login_type) {
    const instituteType = studentAuth.student_id?.institute_id?.institute_type; // 'school' | 'coaching' | 'both'

    if (!instituteType) {
      const error = new Error('Institute information not found for this student');
      error.statusCode = statusCode.FORBIDDEN;
      throw error;
    }

    if (instituteType !== 'both' && instituteType !== login_type) {
      const error = new Error(`A ${instituteType} student cannot log in to the ${login_type} portal`);
      error.statusCode = statusCode.FORBIDDEN;
      throw error;
    }
    // instituteType === 'both' → allow login to either portal
  }

  // Update last login
  studentAuth.last_login_at = new Date();
  await studentAuth.save();

  const authObject = studentAuth.toObject();
  delete authObject.password_hash;
  delete authObject.password_key;
  delete authObject.otp;
  delete authObject.otp_expiry;

  // Fetch active academic mapping for class/section/batch info
  if (authObject.student_id) {
    const activeMapping = await StudentAcademicMapping.findOne({
      student_id: authObject.student_id._id,
      status: 'active'
    })
      .populate('class_id', 'class_name class_type class_level academic_year status')
      .populate('section_id', 'section_name status')
      .populate('batch_id', 'batch_name start_time end_time')
      .lean();
    
    if (activeMapping) {
      authObject.student_id.class_id = activeMapping.class_id;
      authObject.student_id.section_id = activeMapping.section_id;
      authObject.student_id.batch_id = activeMapping.batch_id;
      authObject.student_id.academic_year = activeMapping.academic_year;
      authObject.student_id.roll_number = activeMapping.roll_number;
      authObject.student_id.mapping_type = activeMapping.mapping_type;
    }
  }

  return {
    studentAuth: authObject,
    is_first_login: studentAuth.is_first_login
  };
};

// Request OTP
const requestOTP = async (username) => {
  const studentAuth = await StudentAuth.findOne({ username });
  
  if (!studentAuth) {
    const error = new Error('Student not found with this username');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  // Get primary email
  const primaryEmail = await getPrimaryEmail(studentAuth.student_id);

  // Generate OTP
  const otp = generateOTP();
  const otp_expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  studentAuth.otp = otp;
  studentAuth.otp_expiry = otp_expiry;
  await studentAuth.save();

  // Get student name
  const student = await Student.findById(studentAuth.student_id);
  const studentName = student ? student.full_name : 'Student';

  // Send OTP email
  const emailSubject = 'OTP for Password Reset';
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset OTP</h2>
      <p>Dear ${studentName},</p>
      <p>You have requested to reset your password. Please use the following OTP to proceed:</p>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;">
        <h1 style="color: #007bff; margin: 0; letter-spacing: 5px;">${otp}</h1>
      </div>
      <p><strong>This OTP is valid for 10 minutes.</strong></p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Best regards,<br/>School Management System Team</p>
    </div>
  `;

  await sendEmail(primaryEmail, emailSubject, emailHtml);

  return { message: 'OTP sent successfully to your registered email' };
};

// Verify OTP
const verifyOTP = async (username, otp) => {
  const studentAuth = await StudentAuth.findOne({ username });
  
  if (!studentAuth) {
    const error = new Error('Student not found with this username');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  if (!studentAuth.otp || !studentAuth.otp_expiry) {
    const error = new Error('No OTP found. Please request a new OTP');
    error.statusCode = statusCode.BAD_REQUEST;
    throw error;
  }

  if (new Date() > studentAuth.otp_expiry) {
    const error = new Error('OTP has expired. Please request a new OTP');
    error.statusCode = statusCode.BAD_REQUEST;
    throw error;
  }

  if (studentAuth.otp !== otp) {
    const error = new Error('Invalid OTP');
    error.statusCode = statusCode.UNAUTHORIZED;
    throw error;
  }

  return { message: 'OTP verified successfully', verified: true };
};

// Change password
const changePassword = async (username, old_password, new_password) => {
  const studentAuth = await StudentAuth.findOne({ username });
  
  if (!studentAuth) {
    const error = new Error('Student not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  // Verify old password
  const isPasswordValid = await bcrypt.compare(old_password, studentAuth.password_hash);
  if (!isPasswordValid) {
    const error = new Error('Old password is incorrect');
    error.statusCode = statusCode.UNAUTHORIZED;
    throw error;
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(new_password, salt);

  studentAuth.password_hash = password_hash;
  studentAuth.password_key = null;
  studentAuth.is_first_login = false;
  await studentAuth.save();

  // Get primary email and student name
  const primaryEmail = await getPrimaryEmail(studentAuth.student_id);
  const student = await Student.findById(studentAuth.student_id);
  const studentName = student ? student.full_name : 'Student';

  // Send confirmation email
  const emailSubject = 'Password Changed Successfully';
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Changed</h2>
      <p>Dear ${studentName},</p>
      <p>Your password has been changed successfully.</p>
      <p>If you did not make this change, please contact support immediately.</p>
      <p>Best regards,<br/>School Management System Team</p>
    </div>
  `;

  await sendEmail(primaryEmail, emailSubject, emailHtml);

  return { message: 'Password changed successfully' };
};

// Reset password (with OTP)
const resetPassword = async (username, otp, new_password) => {
  const studentAuth = await StudentAuth.findOne({ username });
  
  if (!studentAuth) {
    const error = new Error('Student not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  // Verify OTP
  if (!studentAuth.otp || !studentAuth.otp_expiry) {
    const error = new Error('No OTP found. Please request a new OTP');
    error.statusCode = statusCode.BAD_REQUEST;
    throw error;
  }

  if (new Date() > studentAuth.otp_expiry) {
    const error = new Error('OTP has expired. Please request a new OTP');
    error.statusCode = statusCode.BAD_REQUEST;
    throw error;
  }

  if (studentAuth.otp !== otp) {
    const error = new Error('Invalid OTP');
    error.statusCode = statusCode.UNAUTHORIZED;
    throw error;
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(new_password, salt);

  studentAuth.password_hash = password_hash;
  studentAuth.password_key = null;
  studentAuth.otp = null;
  studentAuth.otp_expiry = null;
  studentAuth.is_first_login = false;
  await studentAuth.save();

  // Get primary email and student name
  const primaryEmail = await getPrimaryEmail(studentAuth.student_id);
  const student = await Student.findById(studentAuth.student_id);
  const studentName = student ? student.full_name : 'Student';

  // Send confirmation email
  const emailSubject = 'Password Reset Successfully';
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset</h2>
      <p>Dear ${studentName},</p>
      <p>Your password has been reset successfully.</p>
      <p>You can now login with your new password.</p>
      <p>Best regards,<br/>School Management System Team</p>
    </div>
  `;

  await sendEmail(primaryEmail, emailSubject, emailHtml);

  return { message: 'Password reset successfully' };
};

module.exports = {
  createStudentAuth,
  getAllStudentAuths,
  getStudentAuthById,
  getStudentAuthByStudentId,
  getStudentAuthByUsername,
  updateStudentAuth,
  deleteStudentAuth,
  verifyLogin,
  requestOTP,
  verifyOTP,
  changePassword,
  resetPassword
};


























































// const StudentAuth = require('../models/studentAuth.model');
// const Student = require('../models/studentsMaster.model'); 
// const StudentContactInformation = require('../models/studentContactInformation.model');
// const bcrypt = require('bcryptjs');
// const crypto = require('crypto');     
// const nodemailer = require('nodemailer');
// const statusCode = require('../enums/statusCode');   

// // Nodemailer transporter configuration
// const createTransporter = () => { 
//   return nodemailer.createTransport({   
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     secure: process.env.EMAIL_SECURE === 'true',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS 
//     }
//   });
// };
 
// // Generate random 8-digit password
// const generateTemporaryPassword = () => {
//   return Math.floor(10000000 + Math.random() * 90000000).toString();
// };

// // Generate 6-digit OTP
// const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// // Encrypt password using AES-256
// const encryptPassword = (password) => {
//   const algorithm = 'aes-256-cbc'; 
//   const key = Buffer.from(process.env.STUDENT_ENCRYPTION_KEY || process.env.ADMIN_ENCRYPTION_KEY, 'hex');
//   const iv = crypto.randomBytes(16);
  
//   const cipher = crypto.createCipheriv(algorithm, key, iv);
//   let encrypted = cipher.update(password, 'utf8', 'hex');
//   encrypted += cipher.final('hex');  
  
//   return iv.toString('hex') + ':' + encrypted;
// };

// // Decrypt password
// const decryptPassword = (encryptedPassword) => {
//   const algorithm = 'aes-256-cbc';
//   const key = Buffer.from(process.env.STUDENT_ENCRYPTION_KEY || process.env.ADMIN_ENCRYPTION_KEY, 'hex');
  
//   const parts = encryptedPassword.split(':');
//   const iv = Buffer.from(parts[0], 'hex');
//   const encrypted = parts[1];
  
//   const decipher = crypto.createDecipheriv(algorithm, key, iv);
//   let decrypted = decipher.update(encrypted, 'hex', 'utf8');
//   decrypted += decipher.final('utf8');
  
//   return decrypted;
// };

// // Send email
// const sendEmail = async (to, subject, html) => {
//   const transporter = createTransporter();
  
//   const mailOptions = {
//     from: `"School Management System" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     html
//   };
  
//   await transporter.sendMail(mailOptions);
// };

// // Get primary email for student
// const getPrimaryEmail = async (studentId) => {
//   const primaryContact = await StudentContactInformation.findOne({
//     student_id: studentId,
//     is_primary: true
//   });

//   if (!primaryContact || !primaryContact.email) {
//     const error = new Error('No primary email found for this student');
//     error.statusCode = statusCode.NOT_FOUND;
//     throw error;
//   }

//   return primaryContact.email;
// };

// // Create student auth
// const createStudentAuth = async (data) => { 
//   // Check if student exists
//   const student = await Student.findById(data.student_id);
//   if (!student) {
//     const error = new Error('Student not found');
//     error.statusCode = statusCode.NOT_FOUND;
//     throw error;
//   }

//   // Check if student auth already exists
//   const existingAuth = await StudentAuth.findOne({ 
//     $or: [
//       { student_id: data.student_id },
//       { username: student.student_code }
//     ]
//   });
  
//   if (existingAuth) {
//     const error = new Error('Student auth already exists for this student');
//     error.statusCode = statusCode.CONFLICT;
//     throw error;
//   }

//   // Get primary email for the student
//   const primaryEmail = await getPrimaryEmail(data.student_id);

//   // Generate temporary password
//   const temporaryPassword = generateTemporaryPassword();
  
//   // Hash password
//   const salt = await bcrypt.genSalt(10);
//   const password_hash = await bcrypt.hash(temporaryPassword, salt);
  
//   // Encrypt temporary password for password_key
//   const password_key = encryptPassword(temporaryPassword); 

//   // Create student auth
//   const studentAuth = new StudentAuth({
//     student_id: data.student_id,
//     username: student.student_code,
//     password_hash,
//     password_key,
//     is_first_login: true,
//     status: data.status || 'active'
//   });

//   await studentAuth.save();

//   // Send email with credentials
//   const emailSubject = 'Student Portal Credentials Created Successfully';
//   const emailHtml = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//       <h2 style="color: #333;">Welcome to the Student Portal</h2>
//       <p>Dear ${student.full_name || 'Student'},</p>
//       <p>Your Student Portal credentials have been created successfully.</p>
//       <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
//         <p><strong>Username:</strong> ${student.student_code}</p>
//         <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
//       </div>
//       <p style="color: #d9534f;"><strong>Important:</strong> This is a temporary password. You will be required to change it upon your first login.</p>
//       <p>Please keep these credentials secure and do not share them with anyone.</p>
//       <p>Best regards,<br/>School Management System Team</p>
//     </div>
//   `;

//   await sendEmail(primaryEmail, emailSubject, emailHtml);

//   // Remove sensitive data before returning
//   const authObject = studentAuth.toObject();
//   delete authObject.password_hash;
//   delete authObject.password_key;
//   delete authObject.otp;
//   delete authObject.otp_expiry;

//   return authObject;
// };

// // Get all student auths
// const getAllStudentAuths = async () => {
//   const StudentAcademicMapping = require('../models/studentAcademicMapping.model');
  
//   const studentAuths = await StudentAuth.find()
//     // .populate('student_id')
//     .populate({
//       path: 'student_id',
//       populate: {
//         path: 'institute_id',
//         select: 'institute_name institute_code institute_type status'
//       }
//     })
//     .select('-password_hash -password_key -otp -otp_expiry')
//     .lean();
  
//   // Fetch academic mapping for each student
//   for (let auth of studentAuths) {
//     if (auth.student_id) {
//       const activeMapping = await StudentAcademicMapping.findOne({
//         student_id: auth.student_id._id,
//         status: 'active'
//       })
        
//         .populate('class_id', 'class_name class_type class_level academic_year status')
//         .populate('section_id', 'section_name status')
//         .populate('batch_id', 'batch_name start_time end_time')
//         .lean();
      
//       if (activeMapping) {
//         auth.student_id.class_id = activeMapping.class_id;
//         auth.student_id.section_id = activeMapping.section_id;
//         auth.student_id.batch_id = activeMapping.batch_id;
//         auth.student_id.academic_year = activeMapping.academic_year;
//         auth.student_id.roll_number = activeMapping.roll_number;
//         auth.student_id.mapping_type = activeMapping.mapping_type;
//       }
//     }
//   }
  
//   return studentAuths;
// };

// // Get student auth by ID
// const getStudentAuthById = async (id) => {
//   const StudentAcademicMapping = require('../models/studentAcademicMapping.model');
  
//   const studentAuth = await StudentAuth.findById(id)
//     // .populate('student_id')
//     .populate({ 
//       path: 'student_id',
//       populate: {
//         path: 'institute_id',
//         select: 'institute_name institute_code institute_type status'
//       }
//     })
//     .select('-password_hash -password_key -otp -otp_expiry')
//     .lean();
  
//   if (studentAuth && studentAuth.student_id) {
//     const activeMapping = await StudentAcademicMapping.findOne({
//       student_id: studentAuth.student_id._id,
//       status: 'active'
//     })
//       .populate('class_id', 'class_name class_type class_level academic_year status')
//       .populate('section_id', 'section_name status')
//       .populate('batch_id', 'batch_name start_time end_time')
//       .lean();
    
//     if (activeMapping) {
//       studentAuth.student_id.class_id = activeMapping.class_id;
//       studentAuth.student_id.section_id = activeMapping.section_id;
//       studentAuth.student_id.batch_id = activeMapping.batch_id;
//       studentAuth.student_id.academic_year = activeMapping.academic_year;
//       studentAuth.student_id.roll_number = activeMapping.roll_number;
//       studentAuth.student_id.mapping_type = activeMapping.mapping_type;
//     }
//   }
  
//   return studentAuth;
// };

// // Get student auth by student_id
// const getStudentAuthByStudentId = async (studentId) => {
//   const StudentAcademicMapping = require('../models/studentAcademicMapping.model');
  
//   const studentAuth = await StudentAuth.findOne({ student_id: studentId })
//     // .populate('student_id')
//     .populate({
//       path: 'student_id',
//       populate: {
//         path: 'institute_id',
//         select: 'institute_name institute_code institute_type status'
//       }
//     })
//     .select('-password_hash -password_key -otp -otp_expiry')
//     .lean();
  
//   if (studentAuth && studentAuth.student_id) {
//     const activeMapping = await StudentAcademicMapping.findOne({
//       student_id: studentAuth.student_id._id,
//       status: 'active'
//     })
//       .populate('class_id', 'class_name class_type class_level academic_year status')
//       .populate('section_id', 'section_name status')
//       .populate('batch_id', 'batch_name start_time end_time')
//       .lean();
    
//     if (activeMapping) {
//       studentAuth.student_id.class_id = activeMapping.class_id;
//       studentAuth.student_id.section_id = activeMapping.section_id;
//       studentAuth.student_id.batch_id = activeMapping.batch_id;
//       studentAuth.student_id.academic_year = activeMapping.academic_year;
//       studentAuth.student_id.roll_number = activeMapping.roll_number;
//       studentAuth.student_id.mapping_type = activeMapping.mapping_type;
//     }
//   }
  
//   return studentAuth;
// };

// // Get student auth by username
// const getStudentAuthByUsername = async (username) => {
//   const StudentAcademicMapping = require('../models/studentAcademicMapping.model');
  
//   const studentAuth = await StudentAuth.findOne({ username: username })
//     // .populate('student_id')
//     .populate({
//       path: 'student_id',
//       populate: {
//         path: 'institute_id',
//         select: 'institute_name institute_code institute_type status'
//       }
//     })
//     .select('-password_hash -password_key -otp -otp_expiry')
//     .lean();
  
//   if (studentAuth && studentAuth.student_id) {
//     const activeMapping = await StudentAcademicMapping.findOne({
//       student_id: studentAuth.student_id._id,
//       status: 'active'
//     })
//       .populate('class_id', 'class_name class_type class_level academic_year status')
//       .populate('section_id', 'section_name status')
//       .populate('batch_id', 'batch_name start_time end_time')
//       .lean();
    
//     if (activeMapping) {
//       studentAuth.student_id.class_id = activeMapping.class_id;
//       studentAuth.student_id.section_id = activeMapping.section_id;
//       studentAuth.student_id.batch_id = activeMapping.batch_id;
//       studentAuth.student_id.academic_year = activeMapping.academic_year;
//       studentAuth.student_id.roll_number = activeMapping.roll_number;
//       studentAuth.student_id.mapping_type = activeMapping.mapping_type;
//     }
//   }
  
//   return studentAuth;
// };

// // Update student auth
// const updateStudentAuth = async (id, data) => {
//   const StudentAcademicMapping = require('../models/studentAcademicMapping.model');
  
//   const studentAuth = await StudentAuth.findById(id);
//   if (!studentAuth) {
//     const error = new Error('Student auth not found');
//     error.statusCode = statusCode.NOT_FOUND;
//     throw error;
//   }

//   Object.assign(studentAuth, data);
//   await studentAuth.save();

//   const updatedAuth = await StudentAuth.findById(id)
//     // .populate('student_id')
//     .populate({
//       path: 'student_id',
//       populate: {
//         path: 'institute_id',
//         select: 'institute_name institute_code institute_type status'
//       }
//     })
//     .select('-password_hash -password_key -otp -otp_expiry')
//     .lean();

//   if (updatedAuth && updatedAuth.student_id) {
//     const activeMapping = await StudentAcademicMapping.findOne({
//       student_id: updatedAuth.student_id._id,
//       status: 'active'
//     })
//       .populate('class_id', 'class_name class_type class_level academic_year status')
//       .populate('section_id', 'section_name status')
//       .populate('batch_id', 'batch_name start_time end_time')
//       .lean();
    
//     if (activeMapping) {
//       updatedAuth.student_id.class_id = activeMapping.class_id;
//       updatedAuth.student_id.section_id = activeMapping.section_id;
//       updatedAuth.student_id.batch_id = activeMapping.batch_id;
//       updatedAuth.student_id.academic_year = activeMapping.academic_year;
//       updatedAuth.student_id.roll_number = activeMapping.roll_number;
//       updatedAuth.student_id.mapping_type = activeMapping.mapping_type;
//     }
//   }

//   return updatedAuth;
// };

// // Delete student auth
// const deleteStudentAuth = async (id) => {
//   const studentAuth = await StudentAuth.findByIdAndDelete(id);
//   if (!studentAuth) {
//     const error = new Error('Student auth not found');
//     error.statusCode = statusCode.NOT_FOUND;
//     throw error;
//   }

//   return { message: 'Student auth deleted successfully' };
// };

// // Verify login
// const verifyLogin = async (username, password) => {
//   const StudentAcademicMapping = require('../models/studentAcademicMapping.model');
  
//   const studentAuth = await StudentAuth.findOne({ username })
//     .populate({
//       path: 'student_id', 
//       populate: {
//         path: 'institute_id',
//         select: 'institute_name institute_code institute_type status'
//       }
//     });

  
//   if (!studentAuth) {
//     const error = new Error('Invalid username or password');
//     error.statusCode = statusCode.UNAUTHORIZED;
//     throw error;
//   }

//   // Check if student auth is active
//   if (studentAuth.status !== 'active') {
//     const error = new Error(`Account is ${studentAuth.status}. Please contact administrator`);
//     error.statusCode = statusCode.FORBIDDEN;
//     throw error;
//   }

//   // Verify password
//   const isPasswordValid = await bcrypt.compare(password, studentAuth.password_hash);
//   if (!isPasswordValid) {
//     const error = new Error('Invalid username or password');
//     error.statusCode = statusCode.UNAUTHORIZED;
//     throw error;
//   }

//   // Update last login
//   studentAuth.last_login_at = new Date();
//   await studentAuth.save();

//   const authObject = studentAuth.toObject();
//   delete authObject.password_hash;
//   delete authObject.password_key;
//   delete authObject.otp;
//   delete authObject.otp_expiry;

//   // Fetch active academic mapping for class/section/batch info
//   if (authObject.student_id) {
//     const activeMapping = await StudentAcademicMapping.findOne({
//       student_id: authObject.student_id._id,
//       status: 'active'
//     })
//       .populate('class_id', 'class_name class_type class_level academic_year status')
//       .populate('section_id', 'section_name status')
//       .populate('batch_id', 'batch_name start_time end_time')
//       .lean();
    
//     if (activeMapping) {
//       authObject.student_id.class_id = activeMapping.class_id;
//       authObject.student_id.section_id = activeMapping.section_id;
//       authObject.student_id.batch_id = activeMapping.batch_id;
//       authObject.student_id.academic_year = activeMapping.academic_year;
//       authObject.student_id.roll_number = activeMapping.roll_number;
//       authObject.student_id.mapping_type = activeMapping.mapping_type;
//     }
//   }

//   return {
//     studentAuth: authObject,
//     is_first_login: studentAuth.is_first_login
//   };
// };

// // Request OTP
// const requestOTP = async (username) => {
//   const studentAuth = await StudentAuth.findOne({ username });
  
//   if (!studentAuth) {
//     const error = new Error('Student not found with this username');
//     error.statusCode = statusCode.NOT_FOUND;
//     throw error;
//   }

//   // Get primary email
//   const primaryEmail = await getPrimaryEmail(studentAuth.student_id);

//   // Generate OTP
//   const otp = generateOTP();
//   const otp_expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//   studentAuth.otp = otp;
//   studentAuth.otp_expiry = otp_expiry;
//   await studentAuth.save();

//   // Get student name
//   const student = await Student.findById(studentAuth.student_id);
//   const studentName = student ? student.full_name : 'Student';

//   // Send OTP email
//   const emailSubject = 'OTP for Password Reset';
//   const emailHtml = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//       <h2 style="color: #333;">Password Reset OTP</h2>
//       <p>Dear ${studentName},</p>
//       <p>You have requested to reset your password. Please use the following OTP to proceed:</p>
//       <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;">
//         <h1 style="color: #007bff; margin: 0; letter-spacing: 5px;">${otp}</h1>
//       </div>
//       <p><strong>This OTP is valid for 10 minutes.</strong></p>
//       <p>If you did not request this, please ignore this email.</p>
//       <p>Best regards,<br/>School Management System Team</p>
//     </div>
//   `;

//   await sendEmail(primaryEmail, emailSubject, emailHtml);

//   return { message: 'OTP sent successfully to your registered email' };
// };

// // Verify OTP
// const verifyOTP = async (username, otp) => {
//   const studentAuth = await StudentAuth.findOne({ username });
  
//   if (!studentAuth) {
//     const error = new Error('Student not found with this username');
//     error.statusCode = statusCode.NOT_FOUND;
//     throw error;
//   }

//   if (!studentAuth.otp || !studentAuth.otp_expiry) {
//     const error = new Error('No OTP found. Please request a new OTP');
//     error.statusCode = statusCode.BAD_REQUEST;
//     throw error;
//   }

//   if (new Date() > studentAuth.otp_expiry) {
//     const error = new Error('OTP has expired. Please request a new OTP');
//     error.statusCode = statusCode.BAD_REQUEST;
//     throw error;
//   }

//   if (studentAuth.otp !== otp) {
//     const error = new Error('Invalid OTP');
//     error.statusCode = statusCode.UNAUTHORIZED;
//     throw error;
//   }

//   return { message: 'OTP verified successfully', verified: true };
// };

// // Change password
// const changePassword = async (username, old_password, new_password) => {
//   const studentAuth = await StudentAuth.findOne({ username });
  
//   if (!studentAuth) {
//     const error = new Error('Student not found');
//     error.statusCode = statusCode.NOT_FOUND;
//     throw error;
//   }

//   // Verify old password
//   const isPasswordValid = await bcrypt.compare(old_password, studentAuth.password_hash);
//   if (!isPasswordValid) {
//     const error = new Error('Old password is incorrect');
//     error.statusCode = statusCode.UNAUTHORIZED;
//     throw error;
//   }

//   // Hash new password
//   const salt = await bcrypt.genSalt(10);
//   const password_hash = await bcrypt.hash(new_password, salt);

//   studentAuth.password_hash = password_hash;
//   studentAuth.password_key = null;
//   studentAuth.is_first_login = false;
//   await studentAuth.save();

//   // Get primary email and student name
//   const primaryEmail = await getPrimaryEmail(studentAuth.student_id);
//   const student = await Student.findById(studentAuth.student_id);
//   const studentName = student ? student.full_name : 'Student';

//   // Send confirmation email
//   const emailSubject = 'Password Changed Successfully';
//   const emailHtml = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//       <h2 style="color: #333;">Password Changed</h2>
//       <p>Dear ${studentName},</p>
//       <p>Your password has been changed successfully.</p>
//       <p>If you did not make this change, please contact support immediately.</p>
//       <p>Best regards,<br/>School Management System Team</p>
//     </div>
//   `;

//   await sendEmail(primaryEmail, emailSubject, emailHtml);

//   return { message: 'Password changed successfully' };
// };

// // Reset password (with OTP)
// const resetPassword = async (username, otp, new_password) => {
//   const studentAuth = await StudentAuth.findOne({ username });
  
//   if (!studentAuth) {
//     const error = new Error('Student not found');
//     error.statusCode = statusCode.NOT_FOUND;
//     throw error;
//   }

//   // Verify OTP
//   if (!studentAuth.otp || !studentAuth.otp_expiry) {
//     const error = new Error('No OTP found. Please request a new OTP');
//     error.statusCode = statusCode.BAD_REQUEST;
//     throw error;
//   }

//   if (new Date() > studentAuth.otp_expiry) {
//     const error = new Error('OTP has expired. Please request a new OTP');
//     error.statusCode = statusCode.BAD_REQUEST;
//     throw error;
//   }

//   if (studentAuth.otp !== otp) {
//     const error = new Error('Invalid OTP');
//     error.statusCode = statusCode.UNAUTHORIZED;
//     throw error;
//   }

//   // Hash new password
//   const salt = await bcrypt.genSalt(10);
//   const password_hash = await bcrypt.hash(new_password, salt);

//   studentAuth.password_hash = password_hash;
//   studentAuth.password_key = null;
//   studentAuth.otp = null;
//   studentAuth.otp_expiry = null;
//   studentAuth.is_first_login = false;
//   await studentAuth.save();

//   // Get primary email and student name
//   const primaryEmail = await getPrimaryEmail(studentAuth.student_id);
//   const student = await Student.findById(studentAuth.student_id);
//   const studentName = student ? student.full_name : 'Student';

//   // Send confirmation email
//   const emailSubject = 'Password Reset Successfully';
//   const emailHtml = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//       <h2 style="color: #333;">Password Reset</h2>
//       <p>Dear ${studentName},</p>
//       <p>Your password has been reset successfully.</p>
//       <p>You can now login with your new password.</p>
//       <p>Best regards,<br/>School Management System Team</p>
//     </div>
//   `;

//   await sendEmail(primaryEmail, emailSubject, emailHtml);

//   return { message: 'Password reset successfully' };
// };

// module.exports = {
//   createStudentAuth,
//   getAllStudentAuths,
//   getStudentAuthById,
//   getStudentAuthByStudentId,
//   getStudentAuthByUsername,
//   updateStudentAuth,
//   deleteStudentAuth,
//   verifyLogin,
//   requestOTP,
//   verifyOTP,
//   changePassword,
//   resetPassword
// };

