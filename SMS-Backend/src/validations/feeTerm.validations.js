const Joi = require("joi");

const createFeeTermValidation = Joi.object({
  institute_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  academic_year: Joi.string().required(),
  term_order: Joi.number().integer().min(1).allow(null).default(null),
  name: Joi.string().required(),
  start_date: Joi.date().iso().required(),
  due_date: Joi.date().iso().min(Joi.ref("start_date")).required(),
  late_fee_amount: Joi.number().min(0).allow(null).default(null),
  status: Joi.string().valid("active", "inactive").default("active"),
});

const updateFeeTermValidation = Joi.object({
  academic_year: Joi.string(),
  term_order: Joi.number().integer().min(1).allow(null),
  name: Joi.string(),
  start_date: Joi.date().iso(),
  due_date: Joi.date().iso(),
  late_fee_amount: Joi.number().min(0).allow(null),
  status: Joi.string().valid("active", "inactive"),
}).min(1);

module.exports = {
  createFeeTermValidation,
  updateFeeTermValidation,
};
