const Joi = require("joi");


const idParam = Joi.string().hex().length(24).label("MongoId");

// Add Admin
const addAdmin = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Admin name is required",
    "any.required": "Admin name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Admin email is required",
    "string.email": "Invalid email format",
    "any.required": "Admin email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
});

// Update Admin
const updateAdmin = Joi.object({
  id: idParam.required().messages({
    "any.required": "Admin ID is required",
    "string.length": "Invalid Admin ID length",
  }),
  name: Joi.string().optional(),
  email: Joi.string().email().optional().messages({
    "string.email": "Invalid email format",
  }),
  password: Joi.string().min(6).optional().messages({
    "string.min": "Password must be at least 6 characters long",
  }),
});

// Get Admin by ID
const getAdminById = Joi.object({ 
  params: Joi.object({
    id: idParam.required(),
  }),
});

// Remove Admin
const removeAdmin = Joi.object({
  params: Joi.object({
    id: idParam.required(),
  }),
});

// Verify Login
const verifyLogin = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

// Request OTP
const requestOTP = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
});

// Verify OTP
const verifyOTP = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  otp: Joi.number().integer().required().messages({
    "number.base": "OTP must be a number",
    "any.required": "OTP is required",
  }),
});

// Change Password
const changePassword = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.empty": "New password is required",
    "string.min": "New password must be at least 6 characters long",
    "any.required": "New password is required",
  }),
  otp: Joi.number().integer().required().messages({
    "number.base": "OTP must be a number",
    "any.required": "OTP is required",
  }),
});

module.exports = {
  addAdmin,
  updateAdmin,
  getAdminById,
  removeAdmin,
  verifyLogin,
  requestOTP,
  verifyOTP,
  changePassword,
};
