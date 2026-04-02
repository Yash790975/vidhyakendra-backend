 const Joi = require("joi");

const createAssignmentValidation = Joi.object({
  teacher_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid teacher_id format",
      "any.required": "teacher_id is required",
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
    .allow(null, "")
    .messages({
      "string.pattern.base": "Invalid section_id format",
    }),
  subject_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base": "Invalid subject_id format",
    }),
  role: Joi.string()
    .valid(
      "class_teacher",
      "subject_teacher",
      "principal",
      "vice_principal",
      "lab_assistant"
    )
    .required()
    .messages({
      "any.only":
        "role must be one of: class_teacher, subject_teacher, principal, vice_principal, lab_assistant",
      "any.required": "role is required",
    }),
  academic_year: Joi.string().required().messages({
    "any.required": "academic_year is required",
  }),
  assigned_from: Joi.date().optional(),
  assigned_to: Joi.date().optional().allow(null, ""),
});

const updateAssignmentValidation = Joi.object({
  section_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base": "Invalid section_id format",
    }),
  subject_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base": "Invalid subject_id format",
    }),
  role: Joi.string()
    .valid(
      "class_teacher",
      "subject_teacher",
      "principal",
      "vice_principal",
      "lab_assistant"
    )
    .optional()
    .messages({
      "any.only":
        "role must be one of: class_teacher, subject_teacher, principal, vice_principal, lab_assistant",
    }),
  academic_year: Joi.string().optional(),
  assigned_from: Joi.date().optional(),
  assigned_to: Joi.date().optional().allow(null, ""),
  status: Joi.string()
    .valid("active", "inactive", "archived")
    .optional(),
});

module.exports = {
  createAssignmentValidation,
  updateAssignmentValidation,
};