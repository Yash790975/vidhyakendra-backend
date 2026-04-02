const Joi = require("joi");

// Contact Information Validation
const createContactValidation = Joi.object({
  student_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid student_id format",
      "any.required": "student_id is required",
    }),
  contact_type: Joi.string()
    .valid("student", "father", "mother", "guardian")
    .optional()
    .default("student")
    .messages({
      "any.only": "contact_type must be one of: student, father, mother, guardian",
    }),
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Mobile must be 10 digits",
      "any.required": "mobile is required",
    }),
  email: Joi.string().email().optional().allow(null, ""),
  alternate_mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base": "Alternate mobile must be 10 digits",
    }),
  is_primary: Joi.boolean().optional().default(false),
});

const updateContactValidation = Joi.object({
  contact_type: Joi.string()
    .valid("student", "father", "mother", "guardian")
    .optional()
    .messages({
      "any.only": "contact_type must be one of: student, father, mother, guardian",
    }),
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .messages({
      "string.pattern.base": "Mobile must be 10 digits",
    }),
  email: Joi.string().email().optional().allow(null, ""),
  alternate_mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base": "Alternate mobile must be 10 digits",
    }),
  is_primary: Joi.boolean().optional(),
});

const verifyOTPValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "email is required",
    "string.email": "Invalid email format",
  }),
  otp: Joi.string().length(6).required().messages({
    "string.length": "OTP must be 6 digits",
    "any.required": "otp is required",
  }),
});

module.exports = {
  createContactValidation,
  updateContactValidation,
  verifyOTPValidation,
};



















































// const Joi = require("joi");

// // Contact Information Validation
// const createContactValidation = Joi.object({
//   student_id: Joi.string() 
//     .pattern(/^[0-9a-fA-F]{24}$/)
//     .required()
//     .messages({
//       "string.pattern.base": "Invalid student_id format",
//       "any.required": "student_id is required",
//     }),
//   mobile: Joi.string()
//     .pattern(/^[0-9]{10}$/)
//     .required()
//     .messages({
//       "string.pattern.base": "Mobile must be 10 digits",
//       "any.required": "mobile is required",
//     }),
//   email: Joi.string().email().optional().allow(null, ""),
//   alternate_mobile: Joi.string()
//     .pattern(/^[0-9]{10}$/)
//     .optional()
//     .allow(null, "")
//     .messages({
//       "string.pattern.base": "Alternate mobile must be 10 digits",
//     }),
// });

// const verifyOTPValidation = Joi.object({
//   email: Joi.string().email().required().messages({
//     "any.required": "email is required",
//     "string.email": "Invalid email format",
//   }),
//   otp: Joi.string().length(6).required().messages({
//     "string.length": "OTP must be 6 digits",
//     "any.required": "otp is required",
//   }),
// });

// module.exports = {
//   createContactValidation,
//   verifyOTPValidation,
// };