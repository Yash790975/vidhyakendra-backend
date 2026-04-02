const Joi = require('joi');

const createPlanMasterValidation = Joi.object({
  plan_name: Joi.string()
  .trim()
  .required()
  .messages({
    'string.base': 'Plan name must be a string',
    'any.required': 'Plan name is required',
  }),
  plan_type: Joi.string()
    .trim()
    .default('subscription')
    .messages({
      'string.base': 'Plan type must be a string',
    }),
  duration_months: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'number.base': 'Duration months must be a number',
      'number.min': 'Duration must be at least 1 month',
      'any.required': 'Duration in months is required',
    }),
  description: Joi.string()
    .trim()
    .allow('')
    .optional()
    .messages({
      'string.base': 'Description must be a string',
    }),
  is_active: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'is_active must be a boolean',
    }),
});

const updatePlanMasterValidation = Joi.object({
  plan_name: Joi.string()
  .trim()
  .optional()
  .messages({
    'string.base': 'Plan name must be a string',
  }),
  plan_type: Joi.string()
    .trim()
    .optional()
    .messages({
      'string.base': 'Plan type must be a string',
    }),
  duration_months: Joi.number()
    .integer()
    .min(1)
    .optional()
    .messages({
      'number.base': 'Duration months must be a number',
      'number.min': 'Duration must be at least 1 month',
    }),
  description: Joi.string()
    .trim()
    .allow('')
    .optional()
    .messages({
      'string.base': 'Description must be a string',
    }),
  is_active: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'is_active must be a boolean',
    }),
}).min(1);

const idValidation = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid ID format',
      'any.required': 'ID is required',
    }),
});

module.exports = {
  createPlanMasterValidation,
  updatePlanMasterValidation, 
  idValidation,
};