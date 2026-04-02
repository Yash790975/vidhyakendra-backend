
// const Joi = require('joi');

// const createTeacherSubjectValidation = Joi.object({
//   teacher_id: Joi.string().required().messages({
//     'string.empty': 'Teacher ID is required',
//     'any.required': 'Teacher ID is required'
//   }),
//   subject_id: Joi.string().required().messages({
//     'string.empty': 'Subject ID is required',
//     'any.required': 'Subject ID is required'
//   }),
//   is_primary: Joi.boolean().default(false)
// });

// const updateTeacherSubjectValidation = Joi.object({
//   is_primary: Joi.boolean()
// }).min(1);

// const bulkCreateTeacherSubjectsValidation = Joi.object({
//   teacher_id: Joi.string().required().messages({
//     'string.empty': 'Teacher ID is required',
//     'any.required': 'Teacher ID is required'
//   }),
//   subjects: Joi.array().items(
//     Joi.object({
//       subject_id: Joi.string().required(),
//       is_primary: Joi.boolean().default(false)
//     })
//   ).min(1).required().messages({   
//     'array.min': 'At least one subject is required',
//     'any.required': 'Subjects array is required'   
//   }) 
// }); 

// module.exports = {
//   createTeacherSubjectValidation,
//   updateTeacherSubjectValidation,
//   bulkCreateTeacherSubjectsValidation
// };
