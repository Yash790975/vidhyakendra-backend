const Joi = require("joi");

const createClassValidation = Joi.object({
  institute_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid institute_id format",
      "any.required": "institute_id is required",
    }),
  class_name: Joi.string().required().messages({
    "any.required": "class_name is required",
  }),
  class_type: Joi.string()
    .valid("school", "coaching")
    .required()
    .messages({
      "any.only": "class_type must be either school or coaching",
      "any.required": "class_type is required",
    }),
  class_teacher_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base": "Invalid class_teacher_id format",
    }),
  class_level: Joi.string().optional().allow(null, ""),
  academic_year: Joi.string().required().messages({
    "any.required": "academic_year is required",
  }),
});

const updateClassValidation = Joi.object({
  class_name: Joi.string().optional(),
  class_type: Joi.string()
    .valid("school", "coaching")
    .optional()
    .messages({
      "any.only": "class_type must be either school or coaching",
    }),
  class_teacher_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base": "Invalid class_teacher_id format",
    }),
  class_level: Joi.string().optional().allow(null, ""),
  academic_year: Joi.string().optional(),
  status: Joi.string()
    .valid("active", "inactive", "archived")
    .optional(),
});

module.exports = {
  createClassValidation,
  updateClassValidation,
};