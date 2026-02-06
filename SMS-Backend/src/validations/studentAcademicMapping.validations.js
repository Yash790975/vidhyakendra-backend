const Joi = require("joi");

const createMappingValidation = Joi.object({
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
    .allow(null, "")
    .messages({
      "string.pattern.base": "Invalid class_id format",
    }),
  section_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base": "Invalid section_id format",
    }),
  batch_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base": "Invalid batch_id format",
    }),
  mapping_type: Joi.string()
    .valid("school", "coaching")
    .required()
    .messages({
      "any.only": "mapping_type must be either school or coaching",
      "any.required": "mapping_type is required",
    }),
  academic_year: Joi.string().required().messages({
    "any.required": "academic_year is required",
  }),
  roll_number: Joi.string().optional().allow(null, ""),
  joined_at: Joi.date().optional(),
});

const updateMappingValidation = Joi.object({
  class_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base": "Invalid class_id format",
    }),
  section_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base": "Invalid section_id format",
    }),
  batch_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base": "Invalid batch_id format",
    }),
  roll_number: Joi.string().optional().allow(null, ""),
  left_at: Joi.date().optional().allow(null, ""),
  status: Joi.string()
    .valid("active", "promoted", "completed", "dropped", "repeated")
    .optional(),
});

module.exports = {
  createMappingValidation,
  updateMappingValidation,
};