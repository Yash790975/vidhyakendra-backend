const Joi = require("joi");

const createClassSubjectValidation = Joi.object({
  class_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid class_id format",
      "any.required": "class_id is required",
    }),
  subject_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid subject_id format",
      "any.required": "subject_id is required",
    }),
  is_compulsory: Joi.boolean().required().messages({
    "any.required": "is_compulsory is required",
  }),
});

const updateClassSubjectValidation = Joi.object({
  is_compulsory: Joi.boolean().optional(),
});

module.exports = {
  createClassSubjectValidation,
  updateClassSubjectValidation,
};