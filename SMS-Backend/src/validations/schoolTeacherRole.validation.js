// // src/validations/schoolTeacherRole.validation.js

// const Joi = require('joi');

// const createRoleValidation = Joi.object({
//   teacher_id: Joi.string().required().messages({ 
//     'string.empty': 'Teacher ID is required',
//     'any.required': 'Teacher ID is required' 
//   }),
//   role_type: Joi.string()
//     .valid('principal', 'vice_principal', 'class_teacher', 'subject_teacher', 'lab_assistant')
//     .required()
//     .messages({
//       'string.empty': 'Role type is required',
//       'any.only': 'Invalid role type',
//       'any.required': 'Role type is required'
//     }),
//   assigned_class: Joi.string().optional().allow('', null),
//   assigned_section: Joi.string().optional().allow('', null),
//   section: Joi.string().optional().allow('', null),
//   subjects: Joi.array().items(Joi.string()).optional().allow(null)
// });

// const updateRoleValidation = Joi.object({
//   role_type: Joi.string()
//     .valid('principal', 'vice_principal', 'class_teacher', 'subject_teacher', 'lab_assistant')
//     .messages({
//       'any.only': 'Invalid role type'
//     }),
//   assigned_class: Joi.string().optional().allow('', null),
//   assigned_section: Joi.string().optional().allow('', null),
//   section: Joi.string().optional().allow('', null),
//   subjects: Joi.array().items(Joi.string()).optional().allow(null)
// }).min(1);

// const getByRoleTypeValidation = Joi.object({
//   role_type: Joi.string()
//     .valid('principal', 'vice_principal', 'class_teacher', 'subject_teacher', 'lab_assistant')
//     .required()
//     .messages({
//       'string.empty': 'Role type is required',
//       'any.only': 'Invalid role type',
//       'any.required': 'Role type is required'
//     })
// });

// module.exports = {
//   createRoleValidation,
//   updateRoleValidation,
//   getByRoleTypeValidation
// };