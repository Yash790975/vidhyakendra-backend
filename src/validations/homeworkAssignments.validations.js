const Joi = require("joi");

const createHomeworkAssignmentValidation = Joi.object({
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
  subject_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid subject_id format",
      "any.required": "subject_id is required",
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
  assigned_by: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid assigned_by format",
      "any.required": "assigned_by (Teacher ID) is required",
    }),
  assigned_date: Joi.date().required().messages({
    "any.required": "assigned_date is required",
  }),
  due_date: Joi.date().required().messages({
    "any.required": "due_date is required",
  }),
  total_marks: Joi.number().optional().allow(null),
  instructions: Joi.string().optional().allow(null, ""),
  priority: Joi.string().valid("low", "medium", "high").optional().allow(null),
  status: Joi.string()
    .valid("active", "closed", "archived")
    .optional()
    .default("active"),
});

const updateHomeworkAssignmentValidation = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional().allow(null, ""),
  subject_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
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
  assigned_date: Joi.date().optional(),
  due_date: Joi.date().optional(),
  total_marks: Joi.number().optional().allow(null),
  instructions: Joi.string().optional().allow(null, ""),
  priority: Joi.string().valid("low", "medium", "high").optional().allow(null),
  status: Joi.string()
    .valid("active", "closed", "archived")
    .optional(),
});

module.exports = {
  createHomeworkAssignmentValidation,
  updateHomeworkAssignmentValidation,
};
