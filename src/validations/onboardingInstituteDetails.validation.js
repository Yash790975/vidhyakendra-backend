const Joi = require('joi');

const createInstituteDetailsValidation = Joi.object({
  onboarding_basic_info_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid onboarding basic info ID format',
      'any.required': 'Onboarding basic info ID is required',
    }),
  school_board: Joi.string()
    .valid('CBSE', 'ICSE', 'State Board', 'Other')
    .optional()
    .messages({
      'string.base': 'School board must be a string',
      'any.only': 'School board must be one of CBSE, ICSE, State Board, or Other',
    }),
  school_type: Joi.string()
    .valid('private', 'government', 'public')
    .optional()
    .messages({
      'string.base': 'School type must be a string',
      'any.only': 'School type must be one of private, government, or public',
    }),
  classes_offered: Joi.array()
    .items(Joi.string().trim())
    .min(1)
    .required()
    .messages({
      'array.base': 'Classes offered must be an array',
      'array.min': 'At least one class must be offered',
      'any.required': 'Classes offered is required',
    }),
  medium: Joi.string()
    .valid('english', 'hindi', 'other')
    .required()
    .messages({
      'string.base': 'Medium must be a string',
      'any.only': 'Medium must be one of english, hindi, or other',
      'any.required': 'Medium is required',
    }),
  courses_offered: Joi.array()
    .items(Joi.string().trim())
    .optional()
    .messages({
      'array.base': 'Courses offered must be an array',
    }),
  approx_students_range: Joi.string()
    .valid('1-100', '101-250', '251-500', '500-1000', '1000+')
    .required()
    .messages({
      'string.base': 'Approximate students range must be a string',
      'any.only': 'Approximate students range must be one of 1-100, 101-250, 251-500, 500-1000, or 1000+',
      'any.required': 'Approximate students range is required',
    }),
  is_active: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'is_active must be a boolean',
    }),
});

const updateInstituteDetailsValidation = Joi.object({
  onboarding_basic_info_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid onboarding basic info ID format',
    }),
  school_board: Joi.string()
    .valid('CBSE', 'ICSE', 'State Board', 'Other')
    .optional()
    .messages({
      'string.base': 'School board must be a string',
      'any.only': 'School board must be one of CBSE, ICSE, State Board, or Other',
    }),
  school_type: Joi.string()
    .valid('private', 'government', 'public')
    .optional()
    .messages({
      'string.base': 'School type must be a string',
      'any.only': 'School type must be one of private, government, or public',
    }),
  classes_offered: Joi.array()
    .items(Joi.string().trim())
    .min(1)
    .optional()
    .messages({
      'array.base': 'Classes offered must be an array',
      'array.min': 'At least one class must be offered',
    }),
  medium: Joi.string()
    .valid('english', 'hindi', 'other')
    .optional()
    .messages({
      'string.base': 'Medium must be a string',
      'any.only': 'Medium must be one of english, hindi, or other',
    }),
  courses_offered: Joi.array()
    .items(Joi.string().trim())
    .optional()
    .messages({
      'array.base': 'Courses offered must be an array',
    }),
  approx_students_range: Joi.string()
    .valid('1-100', '101-250', '251-500', '500-1000', '1000+')
    .optional()
    .messages({
      'string.base': 'Approximate students range must be a string',
      'any.only': 'Approximate students range must be one of 1-100, 101-250, 251-500, 500-1000, or 1000+',
    }),
  is_active: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'is_active must be a boolean',
    }),
}).min(1);

const idValidation = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid ID format',
      'any.required': 'ID is required',
    }),
});

const getByBasicInfoIdValidation = Joi.object({
  onboarding_basic_info_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid onboarding basic info ID format',
      'any.required': 'Onboarding basic info ID is required',
    }),
});

module.exports = {
  createInstituteDetailsValidation,
  updateInstituteDetailsValidation,
  idValidation,
  getByBasicInfoIdValidation,
};