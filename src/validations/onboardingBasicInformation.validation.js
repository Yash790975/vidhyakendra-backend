const Joi = require('joi');

const createOnboardingValidation = Joi.object({
  institute_name: Joi.string()
    .trim()
    .required()
    .messages({
      'string.base': 'Institute name must be a string',
      'any.required': 'Institute name is required',
    }),
  institute_type: Joi.string()
    .valid('school', 'coaching', 'both')
    .required()
    .messages({
      'string.base': 'Institute type must be a string',
      'any.only': 'Institute type must be one of school, coaching, or both',
      'any.required': 'Institute type is required',
    }),
  owner_name: Joi.string()
    .trim()
    .required()
    .messages({
      'string.base': 'Owner name must be a string',
      'any.required': 'Owner name is required',
    }),
  designation: Joi.string()
    .trim()
    .optional()
    .messages({
      'string.base': 'Designation must be a string',
    }),
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      'string.base': 'Email must be a string',
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required',
    }),
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      'string.base': 'Mobile must be a string',
      'string.pattern.base': 'Please enter a valid 10-digit mobile number',
      'any.required': 'Mobile number is required',
    }),
  address: Joi.string()
    .trim()
    .required()
    .messages({
      'string.base': 'Address must be a string',
      'any.required': 'Address is required',
    }),
  mobile_number_verified: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': 'Mobile number verified must be a boolean',
    }),
  is_active: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'is_active must be a boolean',
    }),
});

const updateOnboardingValidation = Joi.object({
  institute_name: Joi.string()
    .trim()
    .optional()
    .messages({
      'string.base': 'Institute name must be a string',
    }),
  institute_type: Joi.string()
    .valid('school', 'coaching', 'both')
    .optional()
    .messages({
      'string.base': 'Institute type must be a string',
      'any.only': 'Institute type must be one of school, coaching, or both',
    }),
  owner_name: Joi.string()
    .trim()
    .optional()
    .messages({
      'string.base': 'Owner name must be a string',
    }),
  designation: Joi.string()
    .trim()
    .optional()
    .messages({
      'string.base': 'Designation must be a string',
    }),
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .optional()
    .messages({
      'string.base': 'Email must be a string',
      'string.email': 'Please enter a valid email address',
    }),
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .messages({
      'string.base': 'Mobile must be a string',
      'string.pattern.base': 'Please enter a valid 10-digit mobile number',
    }),
  address: Joi.string()
    .trim()
    .optional()
    .messages({
      'string.base': 'Address must be a string',
    }),
  mobile_number_verified: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'Mobile number verified must be a boolean',
    }),
  is_active: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'is_active must be a boolean',
    }),
}).min(1);

const sendOTPValidation = Joi.object({
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      'string.base': 'Mobile must be a string',
      'string.pattern.base': 'Please enter a valid 10-digit mobile number',
      'any.required': 'Mobile number is required',
    }),
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      'string.base': 'Email must be a string',
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required',
    }),
});

const verifyOTPValidation = Joi.object({
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      'string.base': 'Mobile must be a string',
      'string.pattern.base': 'Please enter a valid 10-digit mobile number',
      'any.required': 'Mobile number is required',
    }),
  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      'string.base': 'OTP must be a string',
      'string.length': 'OTP must be 6 digits',
      'string.pattern.base': 'OTP must contain only numbers',
      'any.required': 'OTP is required',
    }),
});

const idValidation = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid ID format',
      'any.required': 'ID is required',
    }),
});

module.exports = {
  createOnboardingValidation,
  updateOnboardingValidation,
  sendOTPValidation,
  verifyOTPValidation,
  idValidation,
};  