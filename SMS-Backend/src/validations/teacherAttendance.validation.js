
const Joi = require('joi');

const createAttendanceValidation = Joi.object({
  teacher_id: Joi.string().required().messages({
    'string.empty': 'Teacher ID is required',
    'any.required': 'Teacher ID is required'
  }),
  date: Joi.date().required().messages({
    'any.required': 'Date is required'
  }),
  status: Joi.string().valid('present', 'absent', 'half_day', 'leave').required().messages({
    'any.required': 'Status is required',
    'any.only': 'Invalid status'
  }),
  check_in_time: Joi.alternatives()
  .try(Joi.date(), Joi.string())
  .allow(null),

check_out_time: Joi.alternatives()
  .try(Joi.date(), Joi.string())
  .allow(null),

  remarks: Joi.string().allow(null)
});

const updateAttendanceValidation = Joi.object({
  date: Joi.date(),
  status: Joi.string().valid('present', 'absent', 'half_day', 'leave'),
  check_in_time: Joi.alternatives()
  .try(Joi.date(), Joi.string())
  .allow(null),

check_out_time: Joi.alternatives()
  .try(Joi.date(), Joi.string())
  .allow(null),

  remarks: Joi.string().allow(null)
}).min(1);

module.exports = {
  createAttendanceValidation,
  updateAttendanceValidation
};
 