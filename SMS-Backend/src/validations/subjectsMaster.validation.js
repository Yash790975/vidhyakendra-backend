
const Joi = require('joi');

const createSubjectValidation = Joi.object({
  institute_id: Joi.string().required().messages({
    'string.empty': 'Institute ID is required', 
    'any.required': 'Institute ID is required' 
  }),
  subject_name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Subject name is required',
    'string.min': 'Subject name must be at least 2 characters',
    'string.max': 'Subject name cannot exceed 100 characters',
    'any.required': 'Subject name is required'
  }),
  subject_code: Joi.string().allow(null),
  subject_type: Joi.string().valid('school', 'coaching', 'both').required().messages({
    'any.required': 'Subject type is required',
    'any.only': 'Invalid subject type'
  }),
  class_levels: Joi.array().items(Joi.string()).allow(null),
  description: Joi.string().allow(null),
  status: Joi.string().valid('active', 'inactive', 'archived').default('active')
});

const updateSubjectValidation = Joi.object({
  subject_name: Joi.string().min(2).max(100),
  subject_code: Joi.string().allow(null),
  subject_type: Joi.string().valid('school', 'coaching', 'both'),
  class_levels: Joi.array().items(Joi.string()).allow(null),
  description: Joi.string().allow(null),
  status: Joi.string().valid('active', 'inactive', 'archived')
}).min(1);

module.exports = {
  createSubjectValidation,
  updateSubjectValidation
};

