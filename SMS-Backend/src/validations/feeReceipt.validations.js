const Joi = require("joi");

const createFeeReceiptValidation = Joi.object({
  institute_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  student_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  student_fee_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  term_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null, "")
    .default(null),
  amount_paid: Joi.number().positive().required(),
  payment_method: Joi.string()
    .valid("cash", "card", "online", "cheque", "upi")
    .required(),
  transaction_id: Joi.string().allow(null, "").default(null),
  payment_date: Joi.date().iso().required(),
  collected_by: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null, "")
    .default(null),
  remarks: Joi.string().allow(null, "").default(null),
});

module.exports = {
  createFeeReceiptValidation,
};
