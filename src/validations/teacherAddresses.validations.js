const Joi = require("joi");

// Address Validation
const createAddressValidation = Joi.object({
  teacher_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  address_type: Joi.string().valid("current", "permanent").required(),
  address: Joi.string().required(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  pincode: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .optional()
    .messages({
      "string.pattern.base": "Pincode must be 6 digits",
    }),
}); 

module.exports = {
  createAddressValidation
};