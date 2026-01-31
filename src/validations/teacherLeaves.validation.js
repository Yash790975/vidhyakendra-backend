// validations/teacherLeaves.validation.js
const Joi = require('joi');

const createLeaveValidation = Joi.object({
  teacher_id: Joi.string().required().messages({
    'string.empty': 'Teacher ID is required',
    'any.required': 'Teacher ID is required'
  }),
  leave_type: Joi.string().valid(
    'casual', 'sick', 'paid', 'unpaid', 'earned',
    'maternity', 'paternity', 'bereavement', 'marriage',
    'study', 'work_from_home', 'half_day',
    'optional_holiday', 'restricted_holiday'
  ).required().messages({
    'any.required': 'Leave type is required',
    'any.only': 'Invalid leave type'
  }),
  from_date: Joi.date().required().messages({
    'any.required': 'From date is required'
  }),
  to_date: Joi.date().min(Joi.ref('from_date')).required().messages({
    'any.required': 'To date is required',
    'date.min': 'To date must be greater than or equal to from date'
  }),
  reason: Joi.string().allow(null),
  status: Joi.string().valid('pending', 'approved', 'rejected').default('pending')
});

const updateLeaveValidation = Joi.object({
  leave_type: Joi.string().valid(
    'casual', 'sick', 'paid', 'unpaid', 'earned',
    'maternity', 'paternity', 'bereavement', 'marriage',
    'study', 'work_from_home', 'half_day',
    'optional_holiday', 'restricted_holiday'
  ),
  from_date: Joi.date(),
  to_date: Joi.date(),
  reason: Joi.string().allow(null),
  status: Joi.string().valid('pending', 'approved', 'rejected'),
  rejection_reason: Joi.string().allow(null)
}).min(1);

// Updated: No longer requires approved_by (comes from JWT token)
const approveLeaveValidation = Joi.object({
  // Empty validation - approved_by is automatically extracted from JWT token
  // Reject any fields passed in the body
}).unknown(false).messages({
  'object.unknown': 'No additional fields are allowed. approved_by is automatically set from authentication token'
});

// Updated: Only rejection_reason required (approved_by comes from JWT token)
const rejectLeaveValidation = Joi.object({
  rejection_reason: Joi.string().required().messages({
    'string.empty': 'Rejection reason is required',
    'any.required': 'Rejection reason is required'
  })
  // approved_by is no longer required in body - comes from JWT token
}).unknown(false).messages({
  'object.unknown': 'Only rejection_reason is allowed. approved_by is automatically set from authentication token'
});

module.exports = {
  createLeaveValidation,
  updateLeaveValidation,
  approveLeaveValidation,
  rejectLeaveValidation
};












































// const Joi = require('joi');

// const createLeaveValidation = Joi.object({
//   teacher_id: Joi.string().required().messages({
//     'string.empty': 'Teacher ID is required',
//     'any.required': 'Teacher ID is required'
//   }),
//   leave_type: Joi.string().valid(
//     'casual', 'sick', 'paid', 'unpaid', 'earned',
//     'maternity', 'paternity', 'bereavement', 'marriage',
//     'study', 'work_from_home', 'half_day',
//     'optional_holiday', 'restricted_holiday'
//   ).required().messages({
//     'any.required': 'Leave type is required',
//     'any.only': 'Invalid leave type'
//   }),
//   from_date: Joi.date().required().messages({
//     'any.required': 'From date is required'
//   }),
//   to_date: Joi.date().min(Joi.ref('from_date')).required().messages({
//     'any.required': 'To date is required',
//     'date.min': 'To date must be greater than or equal to from date'
//   }),
//   reason: Joi.string().allow(null),
//   status: Joi.string().valid('pending', 'approved', 'rejected').default('pending')
// });

// const updateLeaveValidation = Joi.object({
//   leave_type: Joi.string().valid(
//     'casual', 'sick', 'paid', 'unpaid', 'earned',
//     'maternity', 'paternity', 'bereavement', 'marriage',
//     'study', 'work_from_home', 'half_day',
//     'optional_holiday', 'restricted_holiday'
//   ),
//   from_date: Joi.date(),
//   to_date: Joi.date(),
//   reason: Joi.string().allow(null),
//   status: Joi.string().valid('pending', 'approved', 'rejected'),
//   rejection_reason: Joi.string().allow(null)
// }).min(1);

// const approveLeaveValidation = Joi.object({
//   approved_by: Joi.string().required().messages({
//     'string.empty': 'Approver ID is required',
//     'any.required': 'Approver ID is required'
//   })
// });

// const rejectLeaveValidation = Joi.object({
//   approved_by: Joi.string().required().messages({
//     'string.empty': 'Approver ID is required',
//     'any.required': 'Approver ID is required'
//   }),
//   rejection_reason: Joi.string().required().messages({
//     'string.empty': 'Rejection reason is required',
//     'any.required': 'Rejection reason is required'
//   })
// });

// module.exports = {
//   createLeaveValidation,
//   updateLeaveValidation,
//   approveLeaveValidation,
//   rejectLeaveValidation
// };
