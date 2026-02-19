 const Joi = require("joi");

const createGuardianValidation = Joi.object({
  student_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid student_id format",
      "any.required": "student_id is required",
    }),
  name: Joi.string().required().messages({
    "any.required": "name is required",
  }),
  relation: Joi.string()
    .valid(
      "father",
      "mother",
      "guardian",
      "grandfather",
      "grandmother",
      "brother",
      "sister",
      "other"
    )
    .required()
    .messages({
      "any.only":
        "relation must be one of: father, mother, guardian, grandfather, grandmother, brother, sister, other",
      "any.required": "relation is required",
    }),
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "mobile must be 10 digits",
      "any.required": "mobile is required",
    }),
  email: Joi.string().email().optional().allow(null, ""),
  occupation: Joi.string().optional().allow(null, ""),
  is_primary: Joi.boolean().optional().default(false),
});

const updateGuardianValidation = Joi.object({
  name: Joi.string().optional(),
  relation: Joi.string()
    .valid(
      "father",
      "mother",
      "guardian",
      "grandfather",
      "grandmother",
      "brother",
      "sister",
      "other"
    )
    .optional()
    .messages({
      "any.only":
        "relation must be one of: father, mother, guardian, grandfather, grandmother, brother, sister, other",
    }),
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .messages({
      "string.pattern.base": "mobile must be 10 digits",
    }),
  email: Joi.string().email().optional().allow(null, ""),
  occupation: Joi.string().optional().allow(null, ""),
  is_primary: Joi.boolean().optional(),
});

module.exports = {
  createGuardianValidation,
  updateGuardianValidation,
};