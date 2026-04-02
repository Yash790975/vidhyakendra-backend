const Joi = require('joi');

const createDetailValidation = Joi.object({
  teacher_id: Joi.string().required().messages({
    'string.empty': 'Teacher ID is required',
    'any.required': 'Teacher ID is required'
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
  batch_ids: Joi.array().items(Joi.string()).optional().allow(null),
  payout_model: Joi.string()
    .valid('fixed', 'percentage')
    .optional()
    .allow('', null)
    .messages({
      'any.only': 'Payout model must be either "fixed" or "percentage"'
    })
});

const updateDetailValidation = Joi.object({
  role: Joi.string()
    .valid('mentor', 'faculty', 'guest_faculty', 'counsellor')
    .messages({
      'any.only': 'Invalid role'
    }),
  subjects: Joi.array().items(Joi.string()).optional().allow(null),
  batch_ids: Joi.array().items(Joi.string()).optional().allow(null),
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
  batch_id: Joi.string().required().messages({
    'string.empty': 'Batch ID is required',
    'any.required': 'Batch ID is required'
  })
});

const removeBatchValidation = Joi.object({
  batch_id: Joi.string().required().messages({
    'string.empty': 'Batch ID is required',
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