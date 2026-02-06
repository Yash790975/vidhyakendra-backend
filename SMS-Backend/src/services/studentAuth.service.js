// Temporary Password Flow:

// Admin creates auth with generate_temp_password: true
// System generates random 8-char password
// Password stored in password_key field
// is_first_login set to true
// Student must change password on first login
// ------------------------------------------------------------
// Password Change Flow:

// Student logs in with temporary password
// System detects is_first_login: true
// Student forced to change password
// After change: is_first_login: false, password_key: null




















const StudentAuth = require("../models/studentAuth.model");
const StudentsMaster = require("../models/studentsMaster.model");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");

// Generate random temporary password
const generateTempPassword = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Create Student Auth
const createStudentAuth = async (authData) => {
  // Check if student exists
  const student = await StudentsMaster.findById(authData.student_id);
  if (!student) {
    throw new CustomError("Student not found", statusCode.NOT_FOUND);
  }

  // Check if auth already exists for this student
  const existingAuth = await StudentAuth.findOne({
    student_id: authData.student_id,
  });
  if (existingAuth) {
    throw new CustomError(
      "Authentication already exists for this student",
      statusCode.CONFLICT
    );
  }

  // Check if username already exists
  const existingUsername = await StudentAuth.findOne({
    username: authData.username,
  });
  if (existingUsername) {
    throw new CustomError("Username already exists", statusCode.CONFLICT);
  }

  let password = authData.password;
  let tempPassword = null;

  // Generate temporary password if requested
  if (authData.generate_temp_password) {
    tempPassword = generateTempPassword();
    password = tempPassword;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const studentAuth = new StudentAuth({
    student_id: new mongoose.Types.ObjectId(authData.student_id),
    username: authData.username,
    password_hash: password_hash,
    password_key: tempPassword,
    is_first_login: true,
    status: "active",
  });

  await studentAuth.save();

  const result = {
    _id: studentAuth._id,
    student_id: studentAuth.student_id,
    username: studentAuth.username,
    is_first_login: studentAuth.is_first_login,
    status: studentAuth.status,
    createdAt: studentAuth.createdAt,
  };

  // Include temp password in response if generated
  if (tempPassword) {
    result.temporary_password = tempPassword;
    result.message = "Temporary password generated. User must change on first login.";
  }

  return result;
};

// Login
const login = async (username, password) => {
  // Find auth by username
  const auth = await StudentAuth.findOne({ username }).populate(
    "student_id",
    "full_name student_code status"
  );

  if (!auth) {
    throw new CustomError("Invalid username or password", statusCode.UNAUTHORIZED);
  }

  // Check if auth is blocked or disabled
  if (auth.status === "blocked") {
    throw new CustomError("Account is blocked. Contact administrator.", statusCode.FORBIDDEN);
  }

  if (auth.status === "disabled") {
    throw new CustomError("Account is disabled. Contact administrator.", statusCode.FORBIDDEN);
  }

  // Check if student is active
  if (auth.student_id.status !== "active") {
    throw new CustomError("Student account is not active", statusCode.FORBIDDEN);
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, auth.password_hash);
  if (!isPasswordValid) {
    throw new CustomError("Invalid username or password", statusCode.UNAUTHORIZED);
  }

  // Update last login
  auth.last_login_at = new Date();
  await auth.save();

  return {
    _id: auth._id,
    student_id: auth.student_id,
    username: auth.username,
    is_first_login: auth.is_first_login,
    last_login_at: auth.last_login_at,
    status: auth.status,
    message: auth.is_first_login
      ? "First login. Please change your password."
      : "Login successful",
  };
};

// Change Password
const changePassword = async (studentId, oldPassword, newPassword) => {
  const auth = await StudentAuth.findOne({ student_id: studentId });

  if (!auth) {
    throw new CustomError("Authentication not found", statusCode.NOT_FOUND);
  }

  // Verify old password
  const isPasswordValid = await bcrypt.compare(oldPassword, auth.password_hash);
  if (!isPasswordValid) {
    throw new CustomError("Old password is incorrect", statusCode.BAD_REQUEST);
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(newPassword, salt);

  auth.password_hash = password_hash;
  auth.password_key = null; // Clear temp password key
  auth.is_first_login = false;
  await auth.save();

  return { message: "Password changed successfully" };
};

// Reset Password (Admin function)
const resetPassword = async (studentId, newPassword) => {
  const auth = await StudentAuth.findOne({ student_id: studentId });

  if (!auth) {
    throw new CustomError("Authentication not found", statusCode.NOT_FOUND);
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(newPassword, salt);

  auth.password_hash = password_hash;
  auth.password_key = newPassword; // Store as temp password
  auth.is_first_login = true; // Force password change on next login
  await auth.save();

  return {
    message: "Password reset successfully. Student must change password on next login.",
    temporary_password: newPassword,
  };
};

// Get Auth by Student ID
const getAuthByStudentId = async (studentId) => {
  const auth = await StudentAuth.findOne({ student_id: studentId })
    .populate("student_id", "full_name student_code status")
    .select("-password_hash -password_key");

  if (!auth) {
    throw new CustomError("Authentication not found", statusCode.NOT_FOUND);
  }

  return auth;
};

// Get All Student Auths
const getAllStudentAuths = async (filters = {}) => {
  const query = {};

  if (filters.student_id) query.student_id = filters.student_id;
  if (filters.username) query.username = new RegExp(filters.username, "i");
  if (filters.status) query.status = filters.status;
  if (filters.is_first_login !== undefined)
    query.is_first_login = filters.is_first_login;

  const auths = await StudentAuth.find(query)
    .populate("student_id", "full_name student_code status")
    .select("-password_hash -password_key")
    .sort({ createdAt: -1 });

  return auths;
};

// Update Status
const updateStatus = async (studentId, status) => {
  const auth = await StudentAuth.findOne({ student_id: studentId });

  if (!auth) {
    throw new CustomError("Authentication not found", statusCode.NOT_FOUND);
  }

  auth.status = status;
  await auth.save();

  return {
    message: `Status updated to ${status} successfully`,
    status: auth.status,
  };
};

// Delete Auth
const deleteAuth = async (studentId) => {
  const auth = await StudentAuth.findOneAndDelete({ student_id: studentId });

  if (!auth) {
    throw new CustomError("Authentication not found", statusCode.NOT_FOUND);
  }

  return { message: "Authentication deleted successfully" };
};

module.exports = {
  createStudentAuth,
  login,
  changePassword,
  resetPassword,
  getAuthByStudentId,
  getAllStudentAuths,
  updateStatus,
  deleteAuth,
};