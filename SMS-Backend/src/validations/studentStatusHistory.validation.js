 const Joi = require('joi');

const createStatusHistoryValidation = Joi.object({
  student_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.empty': 'Student ID is required',
      'any.required': 'Student ID is required',
      'string.pattern.base': 'Student ID must be a valid MongoDB ObjectId'
    }),
  status: Joi.string()
    .valid('active', 'inactive', 'blocked', 'archived')
    .required()
    .messages({
      'any.required': 'Status is required',
      'any.only': 'Status must be one of: active, inactive, blocked, archived'
    }),
  reason: Joi.string().allow(null, ''),
  changed_at: Joi.date().default(Date.now),
  changed_by: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.empty': 'changed_by (Institute Admin ID) is required',
      'any.required': 'changed_by (Institute Admin ID) is required',
      'string.pattern.base': 'changed_by must be a valid MongoDB ObjectId'
    })
});

const updateStatusHistoryValidation = Joi.object({
  status: Joi.string().valid('active', 'inactive', 'blocked', 'archived'),
  reason: Joi.string().allow(null, ''),
  changed_at: Joi.date(),
  changed_by: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'changed_by must be a valid MongoDB ObjectId'
    })
}).min(1);

module.exports = {
  createStatusHistoryValidation,
  updateStatusHistoryValidation
};