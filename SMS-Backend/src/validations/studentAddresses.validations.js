 const Joi = require("joi");

const createAddressValidation = Joi.object({
  student_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid student_id format",
      "any.required": "student_id is required",
    }),
  address_type: Joi.string()
    .valid("current", "permanent")
    .required()
    .messages({
      "any.only": "address_type must be either current or permanent",
      "any.required": "address_type is required",
    }),
  address: Joi.string().required().messages({
    "any.required": "address is required",
  }),
  city: Joi.string().required().messages({
    "any.required": "city is required",
  }),
  state: Joi.string().required().messages({
    "any.required": "state is required",
  }),
  pincode: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      "string.pattern.base": "pincode must be 6 digits",
      "any.required": "pincode is required",
    }),
});

const updateAddressValidation = Joi.object({
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  pincode: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .optional()
    .messages({
      "string.pattern.base": "pincode must be 6 digits",
    }),
});

module.exports = {
  createAddressValidation,
  updateAddressValidation,
};