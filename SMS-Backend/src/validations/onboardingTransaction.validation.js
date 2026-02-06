const Joi = require('joi');

const createTransactionValidation = Joi.object({
  onboarding_basic_info_id: Joi.string().hex().length(24).required(),
  subscription_plan_variant_id: Joi.string().hex().length(24).required(),

  // amount: Joi.number().min(0).required(),

  // currency: Joi.string().default('INR'),
  payment_gateway: Joi.string().allow('', null),
  payment_transaction_id: Joi.string().allow('', null),
  // payment_status: Joi.string()
  //   .valid('pending', 'success', 'failed', 'refunded') 
  //   .default('pending'),
  // application_status: Joi.string()
  //   .valid(
  //     'payment_received',
  //     'documents_under_review',
  //     'approved',
  //     'rejected',
  //     'account_activated'
  //   )
  //   .default('payment_received'),
  receipt_url: Joi.string().allow('', null),
  is_active: Joi.boolean().default(true)
});

const updateTransactionValidation = Joi.object({
  payment_gateway: Joi.string().allow('', null),
  payment_transaction_id: Joi.string().allow('', null),
  payment_status: Joi.string().valid('pending', 'success', 'failed', 'refunded'),
  application_status: Joi.string().valid(
    'payment_received',
    'documents_under_review',
    'approved',
    'rejected',
    'account_activated'
  ),
  receipt_url: Joi.string().allow('', null),
  is_active: Joi.boolean()
}).min(1);

const updatePaymentStatusValidation = Joi.object({
  payment_status: Joi.string()
    .valid('pending', 'success', 'failed', 'refunded')
    .required(),
  payment_transaction_id: Joi.string().allow('', null),
  payment_gateway: Joi.string().allow('', null)
});

const updateApplicationStatusValidation = Joi.object({
  application_status: Joi.string()
    .valid(
      'payment_received',
      'documents_under_review',
      'approved',
      'rejected',
      'account_activated'
    )
    .required()
});

module.exports = {
  createTransactionValidation,
  updateTransactionValidation,
  updatePaymentStatusValidation,
  updateApplicationStatusValidation
};