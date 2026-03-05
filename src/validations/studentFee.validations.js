const Joi = require("joi");

const feeSnapshotItemSchema = Joi.object({
  name: Joi.string().required(),
  amount: Joi.number().positive().required(),
  frequency: Joi.string().optional(),
});

const createStudentFeeValidation = Joi.object({
  institute_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  student_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  class_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  section_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null, "")
    .default(null),
  academic_year: Joi.string().required(),
  term_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  fee_structure_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  fee_snapshot: Joi.array().items(feeSnapshotItemSchema).min(1).required(),
  total_amount: Joi.number().positive().required(),
  paid_amount: Joi.number().min(0).default(0),
  due_amount: Joi.number().min(0).required(),
  late_fee_applied: Joi.number().min(0).allow(null).default(null),
  due_date: Joi.date().iso().optional(),
  status: Joi.string()
    .valid("pending", "partial", "paid", "overdue")
    .default("pending"),
  is_late_fee_applied: Joi.boolean().default(false),
});

const updateStudentFeeValidation = Joi.object({
  paid_amount: Joi.number().min(0),
  due_amount: Joi.number().min(0),
  late_fee_applied: Joi.number().min(0).allow(null),
  status: Joi.string().valid("pending", "partial", "paid", "overdue"),
  is_late_fee_applied: Joi.boolean(),
}).min(1);

const applyLateFeeValidation = Joi.object({
  late_fee_amount: Joi.number().positive().required(),
});

module.exports = {
  createStudentFeeValidation,
  updateStudentFeeValidation,
  applyLateFeeValidation,
};
