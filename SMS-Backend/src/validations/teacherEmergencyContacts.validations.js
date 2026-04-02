const Joi = require("joi");

// Emergency Contact Validation
const createEmergencyContactValidation = Joi.object({
  teacher_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  name: Joi.string().required(),
  relation: Joi.string().required(),
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Mobile must be 10 digits",
    }),
});

module.exports = {
  createEmergencyContactValidation 
};