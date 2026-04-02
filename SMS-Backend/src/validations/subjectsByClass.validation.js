const Joi = require('joi');

const createSubjectByClassValidation = Joi.object({
  institute_id: Joi.string().required().messages({
    'string.empty': 'Institute ID is required',
    'any.required': 'Institute ID is required'
  }),
  class_id: Joi.string().required().messages({
    'string.empty': 'Class ID is required',
    'any.required': 'Class ID is required'
  }),
  section_id: Joi.string().allow(null, '').default(null),
  subject_name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Subject name is required',
    'string.min': 'Subject name must be at least 2 characters',
    'string.max': 'Subject name cannot exceed 100 characters',
    'any.required': 'Subject name is required'
  }),
  subject_type: Joi.string().valid('theory', 'practical', 'both').required().messages({
    'any.required': 'Subject type is required',
    'any.only': 'Invalid subject type. Must be "theory", "practical", or "both"'
  }),
  status: Joi.string().valid('active', 'inactive').default('active')
});

const updateSubjectByClassValidation = Joi.object({
  subject_type: Joi.string().valid('theory', 'practical', 'both').messages({
    'any.only': 'Invalid subject type. Must be "theory", "practical", or "both"'
  }),
  status: Joi.string().valid('active', 'inactive')
}).min(1);

module.exports = {
  createSubjectByClassValidation,
  updateSubjectByClassValidation
};
