
const Joi = require('joi');

const createAuthValidation = Joi.object({   
  teacher_id: Joi.string().required().messages({
    'string.empty': 'Teacher ID is required',
    'any.required': 'Teacher ID is required'
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required'
  }),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).optional().messages({
    'string.pattern.base': 'Mobile number must be 10 digits'
  }),
  status: Joi.string().valid('active', 'blocked', 'disabled').default('active')
});

const updateAuthValidation = Joi.object({
  email: Joi.string().email().messages({
    'string.email': 'Please provide a valid email'
  }),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).messages({
    'string.pattern.base': 'Mobile number must be 10 digits'
  }),
  status: Joi.string().valid('active', 'blocked', 'disabled')
}).min(1);

const verifyLoginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
    'any.required': 'Password is required'
  })
});

const requestOTPValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required'
  })
});

const verifyOTPValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required'
  }),
  otp: Joi.string().length(6).required().messages({
    'string.empty': 'OTP is required',
    'string.length': 'OTP must be 6 digits',
    'any.required': 'OTP is required'
  })
});

const changePasswordValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required'
  }),
  old_password: Joi.string().required().messages({
    'string.empty': 'Old password is required',
    'any.required': 'Old password is required'
  }),
  new_password: Joi.string().min(8).required().messages({
    'string.empty': 'New password is required',
    'string.min': 'New password must be at least 8 characters',
    'any.required': 'New password is required'
  })
});

const resetPasswordValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required'
  }),
  otp: Joi.string().length(6).required().messages({
    'string.empty': 'OTP is required',
    'string.length': 'OTP must be 6 digits',
    'any.required': 'OTP is required'
  }),
  new_password: Joi.string().min(8).required().messages({
    'string.empty': 'New password is required',
    'string.min': 'New password must be at least 8 characters',
    'any.required': 'New password is required'
  })
});

module.exports = {
  createAuthValidation,
  updateAuthValidation,
  verifyLoginValidation,
  requestOTPValidation,
  verifyOTPValidation,
  changePasswordValidation,
  resetPasswordValidation
};