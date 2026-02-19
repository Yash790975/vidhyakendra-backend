const Joi = require('joi');

const createAuthValidation = Joi.object({   
  student_id: Joi.string().required().messages({
    'string.empty': 'Student ID is required',
    'any.required': 'Student ID is required'   
  }),
  status: Joi.string().valid('active', 'blocked', 'disabled').default('active')
});
   
const updateAuthValidation = Joi.object({
  status: Joi.string().valid('active', 'blocked', 'disabled')
}).min(1);

const verifyLoginValidation = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'Username is required',
    'any.required': 'Username is required'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
    'any.required': 'Password is required'
  })
});

const requestOTPValidation = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'Username is required',
    'any.required': 'Username is required'
  })
});

const verifyOTPValidation = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'Username is required',
    'any.required': 'Username is required'
  }),
  otp: Joi.string().length(6).required().messages({
    'string.empty': 'OTP is required',
    'string.length': 'OTP must be 6 digits',
    'any.required': 'OTP is required'
  })
});

const changePasswordValidation = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'Username is required',
    'any.required': 'Username is required'
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
  username: Joi.string().required().messages({
    'string.empty': 'Username is required',
    'any.required': 'Username is required'
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



























































// const Joi = require("joi");

// // Create Student Auth Validation
// const createStudentAuthValidation = Joi.object({
//   student_id: Joi.string()
//     .pattern(/^[0-9a-fA-F]{24}$/)
//     .required()
//     .messages({
//       "string.pattern.base": "Invalid student_id format",
//       "any.required": "student_id is required",
//     }),
//   username: Joi.string().min(3).max(50).required().messages({
//     "string.min": "username must be at least 3 characters long",
//     "string.max": "username must be at most 50 characters long",
//     "any.required": "username is required",
//   }),
//   password: Joi.string().min(6).required().messages({
//     "string.min": "password must be at least 6 characters long",
//     "any.required": "password is required",
//   }),
//   generate_temp_password: Joi.boolean().optional().default(false),
// });

// // Login Validation
// const loginValidation = Joi.object({
//   username: Joi.string().required().messages({
//     "any.required": "username is required",
//   }),
//   password: Joi.string().required().messages({
//     "any.required": "password is required",
//   }),
// });

// // Change Password Validation
// const changePasswordValidation = Joi.object({
//   old_password: Joi.string().required().messages({
//     "any.required": "old_password is required",
//   }),
//   new_password: Joi.string().min(6).required().messages({
//     "string.min": "new_password must be at least 6 characters long",
//     "any.required": "new_password is required",
//   }),
// });

// // Reset Password Validation
// const resetPasswordValidation = Joi.object({
//   student_id: Joi.string()
//     .pattern(/^[0-9a-fA-F]{24}$/)
//     .required()
//     .messages({
//       "string.pattern.base": "Invalid student_id format",
//       "any.required": "student_id is required",
//     }),
//   new_password: Joi.string().min(6).required().messages({
//     "string.min": "new_password must be at least 6 characters long",
//     "any.required": "new_password is required",
//   }),
// });

// // Update Status Validation
// const updateStatusValidation = Joi.object({
//   status: Joi.string().valid("active", "blocked", "disabled").required().messages({
//     "any.only": "status must be one of: active, blocked, disabled",
//     "any.required": "status is required",
//   }),
// });

// module.exports = {
//   createStudentAuthValidation,
//   loginValidation,
//   changePasswordValidation,
//   resetPasswordValidation,
//   updateStatusValidation,
// };