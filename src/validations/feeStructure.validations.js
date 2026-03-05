const Joi = require("joi");

const feeHeadSchema = Joi.object({
  name: Joi.string().required(),
  amount: Joi.number().positive().required(),
  frequency: Joi.string()
    .valid("one_time", "monthly", "quarterly", "half_yearly", "annual")
    .required(),
  mandatory: Joi.boolean().default(true),
});

const createFeeStructureValidation = Joi.object({
  institute_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  academic_year: Joi.string().allow(null, "").default(null),
  class_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  section_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null, "")
    .default(null),
  fee_heads: Joi.array().items(feeHeadSchema).min(1).required(),
  total_annual_amount: Joi.number().positive().allow(null).default(null),
  status: Joi.string().valid("active", "inactive").default("active"),
});

const updateFeeStructureValidation = Joi.object({
  academic_year: Joi.string().allow(null, ""),
  section_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null, ""),
  fee_heads: Joi.array().items(feeHeadSchema).min(1),
  total_annual_amount: Joi.number().positive().allow(null),
  status: Joi.string().valid("active", "inactive"),
}).min(1);

module.exports = {
  createFeeStructureValidation,
  updateFeeStructureValidation,
};
