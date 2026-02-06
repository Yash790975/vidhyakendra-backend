const Joi = require("joi");

// Contact Information Validation
const createContactValidation = Joi.object({
  teacher_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)    
    .required(),
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Mobile must be 10 digits",
    }),
  email: Joi.string().email().required(),
  alternate_mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .allow(""),
});

const verifyOTPValidation = Joi.object({
  // teacher_id: Joi.string()
  //   .pattern(/^[0-9a-fA-F]{24}$/)
  //   .required(),
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required().messages({
    "string.length": "OTP must be 6 digits",
  }),
});



module.exports = {
  createContactValidation,
  verifyOTPValidation
};