 const Joi = require('joi');

const createSubscriptionTransactionValidation = Joi.object({
  institute_id: Joi.string()
    .pattern(/^[a-fA-F0-9]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'institute_id must be a valid MongoDB ObjectId',
      'any.required': 'institute_id is required'
    }),

  subscription_plan_variant_id: Joi.string()
    .pattern(/^[a-fA-F0-9]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'subscription_plan_variant_id must be a valid MongoDB ObjectId'
    }),

  amount: Joi.number()
    .positive()
    .required()
    .messages({
      'number.positive': 'amount must be a positive number',
      'any.required': 'amount is required'
    }),

  payment_status: Joi.string()
    .valid('success', 'failed', 'refunded')
    .required()
    .messages({
      'any.only': 'payment_status must be one of: success, failed, refunded',
      'any.required': 'payment_status is required'
    }),

  payment_gateway: Joi.string().optional(),

  transaction_id: Joi.string().optional(),

  receipt_url: Joi.string().uri().optional().messages({
    'string.uri': 'receipt_url must be a valid URL'
  }),

  paid_at: Joi.date().iso().optional().messages({
    'date.format': 'paid_at must be a valid ISO date'
  }),

  subscription_start_date: Joi.date().iso().optional().messages({
    'date.format': 'subscription_start_date must be a valid ISO date'
  }),

  subscription_end_date: Joi.date()
    .iso()
    .min(Joi.ref('subscription_start_date'))
    .optional()
    .messages({
      'date.format': 'subscription_end_date must be a valid ISO date',
      'date.min': 'subscription_end_date must be after subscription_start_date'
    }),

  is_active: Joi.boolean().optional()
});

const updateSubscriptionTransactionValidation = Joi.object({
  subscription_plan_variant_id: Joi.string()
    .pattern(/^[a-fA-F0-9]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'subscription_plan_variant_id must be a valid MongoDB ObjectId'
    }),

  amount: Joi.number().positive().optional().messages({
    'number.positive': 'amount must be a positive number'
  }),

  payment_status: Joi.string()
    .valid('success', 'failed', 'refunded')
    .optional()
    .messages({
      'any.only': 'payment_status must be one of: success, failed, refunded'
    }),

  payment_gateway: Joi.string().optional(),

  transaction_id: Joi.string().optional(),

  receipt_url: Joi.string().uri().optional().messages({
    'string.uri': 'receipt_url must be a valid URL'
  }),

  paid_at: Joi.date().iso().optional().messages({
    'date.format': 'paid_at must be a valid ISO date'
  }),

  subscription_start_date: Joi.date().iso().optional().messages({
    'date.format': 'subscription_start_date must be a valid ISO date'
  }),

  subscription_end_date: Joi.date().iso().optional().messages({
    'date.format': 'subscription_end_date must be a valid ISO date'
  }),

  is_active: Joi.boolean().optional()
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

module.exports = {
  createSubscriptionTransactionValidation,
  updateSubscriptionTransactionValidation
};