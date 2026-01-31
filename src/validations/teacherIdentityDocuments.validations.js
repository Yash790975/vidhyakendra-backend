const Joi = require("joi");

// Identity Document Validation
const createIdentityDocValidation = Joi.object({
  teacher_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  document_type: Joi.string()
    .valid("pan_card", "address_card", "photo")
    .required(),
  document_number: Joi.string().required(),
  teacher_name: Joi.string().required().messages({
    "any.required": "teacher_name is required for filename generation",
  }),
});


module.exports = {
  createIdentityDocValidation
};