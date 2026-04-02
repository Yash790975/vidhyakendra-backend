const Joi = require('joi');

const createAttendanceValidation = Joi.object({
  student_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.empty': 'Student ID is required',
      'any.required': 'Student ID is required',
      'string.pattern.base': 'Student ID must be a valid MongoDB ObjectId'
    }),
  class_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.empty': 'Class ID is required',
      'any.required': 'Class ID is required',
      'string.pattern.base': 'Class ID must be a valid MongoDB ObjectId'
    }),
  section_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
    .messages({
      'string.pattern.base': 'Section ID must be a valid MongoDB ObjectId'
    }),
  batch_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
    .messages({
      'string.pattern.base': 'Batch ID must be a valid MongoDB ObjectId'
    }),
  date: Joi.date().required().messages({
    'any.required': 'Date is required'
  }),
  status: Joi.string()
    .valid('present', 'absent', 'leave')
    .required()
    .messages({
      'any.required': 'Status is required',
      'any.only': 'Status must be one of: present, absent, leave'
    }),
  marked_by: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.empty': 'marked_by (Teacher ID) is required',
      'any.required': 'marked_by (Teacher ID) is required',
      'string.pattern.base': 'marked_by must be a valid MongoDB ObjectId'
    })
});

const bulkCreateAttendanceValidation = Joi.object({
  attendances: Joi.array()
    .items(createAttendanceValidation)
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one attendance record is required',
      'any.required': 'Attendances array is required'
    })
});

const updateAttendanceValidation = Joi.object({
  class_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Class ID must be a valid MongoDB ObjectId'
    }),
  section_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
    .messages({
      'string.pattern.base': 'Section ID must be a valid MongoDB ObjectId'
    }),
  batch_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
    .messages({
      'string.pattern.base': 'Batch ID must be a valid MongoDB ObjectId'
    }),
  date: Joi.date(),
  status: Joi.string().valid('present', 'absent', 'leave'),
  marked_by: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'marked_by must be a valid MongoDB ObjectId'
    })
}).min(1);

module.exports = {
  createAttendanceValidation,
  bulkCreateAttendanceValidation,
  updateAttendanceValidation
};