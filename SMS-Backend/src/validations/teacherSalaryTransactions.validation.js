
const Joi = require('joi');

const createTransactionValidation = Joi.object({
  teacher_id: Joi.string().required().messages({
    'string.empty': 'Teacher ID is required',
    'any.required': 'Teacher ID is required'
  }),
  amount: Joi.number().min(0).required().messages({
    'number.base': 'Amount must be a number',
    'number.min': 'Amount must be positive',
    'any.required': 'Amount is required'
  }),
  payment_month: Joi.string().pattern(/^\d{4}-(0[1-9]|1[0-2])$/).required().messages({
    'string.empty': 'Payment month is required',
    'string.pattern.base': 'Payment month must be in YYYY-MM format',
    'any.required': 'Payment month is required'
  }),
  payment_date: Joi.date().allow(null),
  payment_mode: Joi.string().valid('bank_transfer', 'upi', 'cash').allow(null),
  reference_id: Joi.string().allow(null),
  status: Joi.string().valid('pending', 'paid', 'failed').default('pending')
});

const updateTransactionValidation = Joi.object({
  amount: Joi.number().min(0),
  payment_month: Joi.string().pattern(/^\d{4}-(0[1-9]|1[0-2])$/),
  payment_date: Joi.date().allow(null),
  payment_mode: Joi.string().valid('bank_transfer', 'upi', 'cash').allow(null),
  reference_id: Joi.string().allow(null),
  status: Joi.string().valid('pending', 'paid', 'failed')
}).min(1);

module.exports = {
  createTransactionValidation,
  updateTransactionValidation
};