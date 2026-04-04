const Joi = require('joi');

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const createDetailValidation = Joi.object({
  teacher_id: Joi.string()
    .pattern(objectIdPattern)
    .required()
    .messages({
      'string.empty': 'Teacher ID is required',
      'string.pattern.base': 'Invalid teacher_id format',
      'any.required': 'Teacher ID is required'
    }),
  institute_id: Joi.string()                               //  NEW
    .pattern(objectIdPattern)
    .required()
    .messages({
      'string.empty': 'Institute ID is required',
      'string.pattern.base': 'Invalid institute_id format',
      'any.required': 'Institute ID is required'
    }),
  role: Joi.string()
    .valid('mentor', 'faculty', 'guest_faculty', 'counsellor')
    .required()
    .messages({
      'string.empty': 'Role is required',
      'any.only': 'Invalid role',
      'any.required': 'Role is required'
    }),
  subjects: Joi.array().items(Joi.string()).optional().allow(null),
  batch_ids: Joi.array().items(Joi.string().pattern(objectIdPattern)).optional().allow(null),
  payout_model: Joi.string()
    .valid('fixed', 'percentage')
    .optional()
    .allow('', null)
    .messages({
      'any.only': 'Payout model must be either "fixed" or "percentage"'
    })
});

const updateDetailValidation = Joi.object({
  institute_id: Joi.string()                               //  NEW (allow update)
    .pattern(objectIdPattern)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid institute_id format'
    }),
  role: Joi.string()
    .valid('mentor', 'faculty', 'guest_faculty', 'counsellor')
    .optional()
    .messages({ 'any.only': 'Invalid role' }),
  subjects: Joi.array().items(Joi.string()).optional().allow(null),
  batch_ids: Joi.array().items(Joi.string().pattern(objectIdPattern)).optional().allow(null),
  payout_model: Joi.string()
    .valid('fixed', 'percentage')
    .optional()
    .allow('', null)
    .messages({
      'any.only': 'Payout model must be either "fixed" or "percentage"'
    })
}).min(1);

const getByRoleValidation = Joi.object({
  role: Joi.string()
    .valid('mentor', 'faculty', 'guest_faculty', 'counsellor')
    .required()
    .messages({
      'string.empty': 'Role is required',
      'any.only': 'Invalid role',
      'any.required': 'Role is required'
    })
});

const addBatchValidation = Joi.object({
  batch_id: Joi.string()
    .pattern(objectIdPattern)
    .required()
    .messages({
      'string.empty': 'Batch ID is required',
      'string.pattern.base': 'Invalid batch_id format',
      'any.required': 'Batch ID is required'
    })
});

const removeBatchValidation = Joi.object({
  batch_id: Joi.string()
    .pattern(objectIdPattern)
    .required()
    .messages({
      'string.empty': 'Batch ID is required',
      'string.pattern.base': 'Invalid batch_id format',
      'any.required': 'Batch ID is required'
    })
});

module.exports = {
  createDetailValidation,
  updateDetailValidation,
  getByRoleValidation,
  addBatchValidation,
  removeBatchValidation
};