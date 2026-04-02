const Joi = require("joi");

const createBatchValidation = Joi.object({
  class_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid class_id format",
      "any.required": "class_id is required",
    }),
  batch_name: Joi.string().required().messages({
    "any.required": "batch_name is required",
  }),
  start_time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      "string.pattern.base": "start_time must be in HH:MM format (e.g., 10:00)",
      "any.required": "start_time is required",
    }),
  end_time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      "string.pattern.base": "end_time must be in HH:MM format (e.g., 11:00)",
      "any.required": "end_time is required",
    }),
  capacity: Joi.number().integer().positive().optional().allow(null),
});

const updateBatchValidation = Joi.object({
  batch_name: Joi.string().optional(),
  start_time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional()
    .messages({
      "string.pattern.base": "start_time must be in HH:MM format (e.g., 10:00)",
    }),
  end_time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional()
    .messages({
      "string.pattern.base": "end_time must be in HH:MM format (e.g., 11:00)",
    }),
  capacity: Joi.number().integer().positive().optional().allow(null),
  status: Joi.string()
    .valid("active", "inactive", "archived")
    .optional(),
});

module.exports = {
  createBatchValidation,
  updateBatchValidation,
};