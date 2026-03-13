const Joi = require("joi");

const startAttemptValidation = Joi.object({
  institute_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid institute_id format",
      "any.required": "institute_id is required",
    }),
  assessment_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid assessment_id format",
      "any.required": "assessment_id is required",
    }),
  student_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid student_id format",
      "any.required": "student_id is required",
    }),
  class_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, ""),
  section_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, ""),
  batch_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, ""),
});

const submitAttemptValidation = Joi.object({
  time_taken_seconds: Joi.number().integer().optional().allow(null),
});

const evaluateAttemptValidation = Joi.object({
  evaluated_by: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid evaluated_by format",
      "any.required": "evaluated_by (Teacher ID) is required",
    }),
  remarks: Joi.string().optional().allow(null, ""),
});

module.exports = {
  startAttemptValidation,
  submitAttemptValidation,
  evaluateAttemptValidation,
};
