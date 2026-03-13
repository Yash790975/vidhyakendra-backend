const Joi = require("joi");

const createAssessmentValidation = Joi.object({
  institute_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid institute_id format",
      "any.required": "institute_id is required",
    }),
  title: Joi.string().required().messages({
    "any.required": "title is required",
  }),
  description: Joi.string().optional().allow(null, ""),
  assessment_type: Joi.string()
    .valid("mcq", "short_answer", "mixed")
    .required()
    .messages({
      "any.only": "assessment_type must be mcq, short_answer, or mixed",
      "any.required": "assessment_type is required",
    }),
  class_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid class_id format",
      "any.required": "class_id is required",
    }),
  section_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, ""),
  batch_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, ""),
  subject_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid subject_id format",
      "any.required": "subject_id is required",
    }),
  academic_year: Joi.string().required().messages({
    "any.required": "academic_year is required",
  }),
  total_marks: Joi.number().optional().allow(null),
  pass_marks: Joi.number().optional().allow(null),
  duration_minutes: Joi.number().integer().optional().allow(null),
  available_from: Joi.date().optional().allow(null),
  available_until: Joi.date().optional().allow(null),
  max_attempts: Joi.number().integer().optional().allow(null),
  show_result_immediately: Joi.boolean().optional().allow(null),
  show_answer_key: Joi.boolean().optional().allow(null),
  status: Joi.string()
    .valid("draft", "published", "closed")
    .optional()
    .default("draft"),
  created_by: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid created_by format",
      "any.required": "created_by (Teacher ID) is required",
    }),
});

const updateAssessmentValidation = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional().allow(null, ""),
  assessment_type: Joi.string()
    .valid("mcq", "short_answer", "mixed")
    .optional(),
  class_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional(),
  section_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, ""),
  batch_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, ""),
  subject_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional(),
  academic_year: Joi.string().optional(),
  total_marks: Joi.number().optional().allow(null),
  pass_marks: Joi.number().optional().allow(null),
  duration_minutes: Joi.number().integer().optional().allow(null),
  available_from: Joi.date().optional().allow(null),
  available_until: Joi.date().optional().allow(null),
  max_attempts: Joi.number().integer().optional().allow(null),
  show_result_immediately: Joi.boolean().optional().allow(null),
  show_answer_key: Joi.boolean().optional().allow(null),
  status: Joi.string().valid("draft", "published", "closed").optional(),
});

module.exports = {
  createAssessmentValidation,
  updateAssessmentValidation,
};
