const Joi = require("joi");

const createExamValidation = Joi.object({
  institute_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid institute_id format",
      "any.required": "institute_id is required",
    }),
  exam_name: Joi.string().required().messages({
    "any.required": "exam_name is required",
  }),
  exam_code: Joi.string().optional().allow(null, ""),
  exam_type: Joi.string()
    .valid("quarterly", "half_yearly", "annual", "unit_test", "mock", "entrance")
    .required()
    .messages({
      "any.only": "exam_type must be one of: quarterly, half_yearly, annual, unit_test, mock, entrance",
      "any.required": "exam_type is required",
    }),
  academic_year: Joi.string().required().messages({
    "any.required": "academic_year is required",
  }),
  term: Joi.string().optional().allow(null, ""),
  start_date: Joi.date().optional().allow(null),
  end_date: Joi.date().optional().allow(null),
  description: Joi.string().optional().allow(null, ""),
  instructions: Joi.string().optional().allow(null, ""),
  status: Joi.string()
    .valid("draft", "scheduled", "ongoing", "completed", "archived")
    .optional()
    .default("draft"),
  created_by: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, ""),
  created_by_role: Joi.string()
    .valid("institute_admin", "teacher")
    .optional()
    .allow(null, ""),
});

const updateExamValidation = Joi.object({
  exam_name: Joi.string().optional(),
  exam_code: Joi.string().optional().allow(null, ""),
  exam_type: Joi.string()
    .valid("quarterly", "half_yearly", "annual", "unit_test", "mock", "entrance")
    .optional(),
  academic_year: Joi.string().optional(),
  term: Joi.string().optional().allow(null, ""),
  start_date: Joi.date().optional().allow(null),
  end_date: Joi.date().optional().allow(null),
  description: Joi.string().optional().allow(null, ""),
  instructions: Joi.string().optional().allow(null, ""),
  status: Joi.string()
    .valid("draft", "scheduled", "ongoing", "completed", "archived")
    .optional(),
});

module.exports = {
  createExamValidation,
  updateExamValidation,
};
