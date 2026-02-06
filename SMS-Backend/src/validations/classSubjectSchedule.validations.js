const Joi = require("joi");

const createScheduleValidation = Joi.object({
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
    .required()
    .messages({
      "string.pattern.base": "Invalid subject_id format",
      "any.required": "subject_id is required",
    }),
  teacher_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base": "Invalid teacher_id format",
    }),
  day_of_week: Joi.string()
    .valid("mon", "tue", "wed", "thu", "fri", "sat")
    .optional()
    .allow(null, "")
    .messages({
      "any.only": "day_of_week must be one of: mon, tue, wed, thu, fri, sat",
    }),
  start_time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      "string.pattern.base": "start_time must be in HH:MM format (e.g., 08:00)",
      "any.required": "start_time is required",
    }),
  end_time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      "string.pattern.base": "end_time must be in HH:MM format (e.g., 10:00)",
      "any.required": "end_time is required",
    }),
  room_no: Joi.string().optional().allow(null, ""),
});

const updateScheduleValidation = Joi.object({
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
    .messages({
      "string.pattern.base": "Invalid subject_id format",
    }),
  teacher_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base": "Invalid teacher_id format",
    }),
  day_of_week: Joi.string()
    .valid("mon", "tue", "wed", "thu", "fri", "sat")
    .optional()
    .allow(null, "")
    .messages({
      "any.only": "day_of_week must be one of: mon, tue, wed, thu, fri, sat",
    }),
  start_time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional()
    .messages({
      "string.pattern.base": "start_time must be in HH:MM format (e.g., 08:00)",
    }),
  end_time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional()
    .messages({
      "string.pattern.base": "end_time must be in HH:MM format (e.g., 10:00)",
    }),
  room_no: Joi.string().optional().allow(null, ""),
  status: Joi.string().valid("active", "inactive").optional(),
});

module.exports = {
  createScheduleValidation,
  updateScheduleValidation,
};