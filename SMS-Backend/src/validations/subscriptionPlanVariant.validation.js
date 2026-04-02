const Joi = require('joi');

const createPlanVariantValidation = Joi.object({
  plan_master_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid plan master ID format',
      'any.required': 'Plan master ID is required',
    }),
  applicable_for: Joi.string()
    .valid('school', 'coaching', 'both')
    .required()
    .messages({
      'string.base': 'Applicable for must be a string',
      'any.only': 'Applicable for must be one of school, coaching, or both',
      'any.required': 'Applicable for is required',
    }),
  price: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price cannot be negative',
      'any.required': 'Price is required',
    }),
  discount_percentage: Joi.number()
    .min(0)
    .max(100)
    .default(0)
    .messages({
      'number.base': 'Discount percentage must be a number',
      'number.min': 'Discount percentage cannot be negative',
      'number.max': 'Discount percentage cannot exceed 100',
    }),
  features: Joi.object()
    .default({})
    .messages({
      'object.base': 'Features must be an object',
    }),
  is_active: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'is_active must be a boolean',
    }),
});

const updatePlanVariantValidation = Joi.object({
  plan_master_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid plan master ID format',
    }),
  applicable_for: Joi.string()
    .valid('school', 'coaching', 'both')
    .optional()
    .messages({
      'string.base': 'Applicable for must be a string',
      'any.only': 'Applicable for must be one of school, coaching, or both',
    }),
  price: Joi.number()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price cannot be negative',
    }),
  discount_percentage: Joi.number()
    .min(0)
    .max(100)
    .optional()
    .messages({
      'number.base': 'Discount percentage must be a number',
      'number.min': 'Discount percentage cannot be negative',
      'number.max': 'Discount percentage cannot exceed 100',
    }),
  features: Joi.object()
    .optional()
    .messages({
      'object.base': 'Features must be an object',
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

const getByInstituteTypeValidation = Joi.object({
  institute_type: Joi.string()
    .valid('school', 'coaching', 'both')
    .required()
    .messages({
      'string.base': 'Institute type must be a string',
      'any.only': 'Institute type must be one of school, coaching, or both',
      'any.required': 'Institute type is required',
    }),
});

module.exports = {
  createPlanVariantValidation,
  updatePlanVariantValidation,
  idValidation,
  getByInstituteTypeValidation,
};