const Joi = require("joi");


// Bank Details Validation
const createBankDetailsValidation = Joi.object({
  teacher_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  account_holder_name: Joi.string().required(),
  bank_name: Joi.string().optional(),
  account_number: Joi.string().required(),
  ifsc_code: Joi.string()
    .pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid IFSC code format",
    }),
  upi_id: Joi.string().optional().allow(null, ""),
  is_primary: Joi.boolean().optional(),
});


module.exports = {

  createBankDetailsValidation
};