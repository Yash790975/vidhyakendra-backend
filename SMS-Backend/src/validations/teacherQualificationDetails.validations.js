const Joi = require("joi");



// Qualification Validation
const createQualificationValidation = Joi.object({
  teacher_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  qualification: Joi.string().required(),
  specialization: Joi.string().optional(),
  institute_name: Joi.string().optional(),
  passing_year: Joi.date().optional(),
  teacher_name: Joi.string().required(),
});
 


module.exports = {
  createQualificationValidation,
};