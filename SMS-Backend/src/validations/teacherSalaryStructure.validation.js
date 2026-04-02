// validations/teacherSalaryStructure.validation.js
const Joi = require('joi');

const createSalaryStructureValidation = Joi.object({
  teacher_id: Joi.string().required().messages({
    'string.empty': 'Teacher ID is required', 
    'any.required': 'Teacher ID is required'
  }),
  salary_type: Joi.string().valid('fixed_monthly', 'per_lecture', 'hourly', 'percentage', 'hybrid').required().messages({
    'any.required': 'Salary type is required',
    'any.only': 'Invalid salary type'
  }),
  pay_frequency: Joi.string().valid('monthly', 'weekly', 'bi_weekly', 'per_session').required().messages({
    'any.required': 'Pay frequency is required',
    'any.only': 'Invalid pay frequency'
  }),
  currency: Joi.string().default('INR'),
  basic_salary: Joi.number().min(0).allow(null),
  hra: Joi.number().min(0).allow(null),
  da: Joi.number().min(0).allow(null),
  conveyance_allowance: Joi.number().min(0).allow(null),
  medical_allowance: Joi.number().min(0).allow(null),
  per_lecture_rate: Joi.number().min(0).allow(null),
  hourly_rate: Joi.number().min(0).allow(null),
  revenue_percentage: Joi.number().min(0).max(100).allow(null),
  incentive_amount: Joi.number().min(0).allow(null),
  bonus_amount: Joi.number().min(0).allow(null),
  max_lectures_per_month: Joi.number().integer().min(0).allow(null),
  max_hours_per_month: Joi.number().integer().min(0).allow(null),
  pf_applicable: Joi.boolean().default(false),
  pf_percentage: Joi.number().min(0).max(100).allow(null),
  tds_applicable: Joi.boolean().default(false),
  tds_percentage: Joi.number().min(0).max(100).allow(null),
  other_deductions: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      amount: Joi.number().required()
    })
  ).allow(null),
  effective_from: Joi.date().required().messages({
    'any.required': 'Effective from date is required'
  }),
  effective_to: Joi.date().allow(null),
  approved_by: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
    .messages({
      'string.pattern.base': 'approved_by must be a valid MongoDB ObjectId'
    }),
  approved_at: Joi.date().allow(null),
  remarks: Joi.string().allow(null),
  status: Joi.string().valid('active', 'inactive', 'archived').default('active')
});

const updateSalaryStructureValidation = Joi.object({
  salary_type: Joi.string().valid('fixed_monthly', 'per_lecture', 'hourly', 'percentage', 'hybrid'),
  pay_frequency: Joi.string().valid('monthly', 'weekly', 'bi_weekly', 'per_session'),
  currency: Joi.string(),
  basic_salary: Joi.number().min(0).allow(null),
  hra: Joi.number().min(0).allow(null),
  da: Joi.number().min(0).allow(null),
  conveyance_allowance: Joi.number().min(0).allow(null),
  medical_allowance: Joi.number().min(0).allow(null),
  per_lecture_rate: Joi.number().min(0).allow(null),
  hourly_rate: Joi.number().min(0).allow(null),
  revenue_percentage: Joi.number().min(0).max(100).allow(null),
  incentive_amount: Joi.number().min(0).allow(null),
  bonus_amount: Joi.number().min(0).allow(null),
  max_lectures_per_month: Joi.number().integer().min(0).allow(null), 
  max_hours_per_month: Joi.number().integer().min(0).allow(null),
  pf_applicable: Joi.boolean(),
  pf_percentage: Joi.number().min(0).max(100).allow(null),
  tds_applicable: Joi.boolean(),
  tds_percentage: Joi.number().min(0).max(100).allow(null),
  other_deductions: Joi.array().items( 
    Joi.object({
      name: Joi.string().required(),
      amount: Joi.number().required()
    }) 
  ).allow(null),
  effective_from: Joi.date(),
  effective_to: Joi.date().allow(null),
  approved_by: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
    .messages({
      'string.pattern.base': 'approved_by must be a valid MongoDB ObjectId'
    }),
  approved_at: Joi.date().allow(null),
  remarks: Joi.string().allow(null),
  status: Joi.string().valid('active', 'inactive', 'archived')
}).min(1);

const approveSalaryStructureValidation = Joi.object({
  approved_by: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.empty': 'approved_by (Institute Admin ID) is required',
      'any.required': 'approved_by (Institute Admin ID) is required',
      'string.pattern.base': 'approved_by must be a valid MongoDB ObjectId'
    })
});

const archiveSalaryStructureValidation = Joi.object({
  approved_by: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
    .messages({
      'string.pattern.base': 'approved_by must be a valid MongoDB ObjectId'
    })
});

module.exports = {
  createSalaryStructureValidation,
  updateSalaryStructureValidation,
  approveSalaryStructureValidation,
  archiveSalaryStructureValidation
};

