const Joi = require("joi");

const createExamScheduleValidation = Joi.object({
  exam_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid exam_id format",
      "any.required": "exam_id is required",
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
  exam_date: Joi.date().required().messages({
    "any.required": "exam_date is required",
  }),
  start_time: Joi.string().optional().allow(null, ""),
  end_time: Joi.string().optional().allow(null, ""),
  duration_minutes: Joi.number().optional().allow(null),
  room_number: Joi.string().optional().allow(null, ""),
  total_marks: Joi.number().required().messages({
    "any.required": "total_marks is required",
  }),
  pass_marks: Joi.number().optional().allow(null),
  theory_marks: Joi.number().optional().allow(null),
  practical_marks: Joi.number().optional().allow(null),
  invigilator_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, ""),
  status: Joi.string()
    .valid("scheduled", "ongoing", "completed", "cancelled")
    .optional()
    .default("scheduled"),
});

const updateExamScheduleValidation = Joi.object({
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
  exam_date: Joi.date().optional(),
  start_time: Joi.string().optional().allow(null, ""),
  end_time: Joi.string().optional().allow(null, ""),
  duration_minutes: Joi.number().optional().allow(null),
  room_number: Joi.string().optional().allow(null, ""),
  total_marks: Joi.number().optional(),
  pass_marks: Joi.number().optional().allow(null),
  theory_marks: Joi.number().optional().allow(null),
  practical_marks: Joi.number().optional().allow(null),
  invigilator_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, ""),
  status: Joi.string()
    .valid("scheduled", "ongoing", "completed", "cancelled")
    .optional(),
});

module.exports = {
  createExamScheduleValidation,
  updateExamScheduleValidation,
};
