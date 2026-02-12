const Joi = require("joi");

// Students Master Validation
const createStudentValidation = Joi.object({
  institute_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) 
    .required()
    .messages({
      "string.pattern.base": "Invalid institute_id format",
      "any.required": "institute_id is required",
    }),
  student_type: Joi.string()
    .valid("school", "coaching")
    .required()
    .messages({
      "any.only": "student_type must be either school or coaching",
      "any.required": "student_type is required",
    }),
  full_name: Joi.string().required().messages({
    "any.required": "full_name is required",
  }),
  gender: Joi.string()
    .valid("male", "female", "other")
    .required()
    .messages({
      "any.only": "gender must be male, female, or other",
      "any.required": "gender is required",
    }),
  date_of_birth: Joi.date().required().messages({
    "any.required": "date_of_birth is required",
  }),
  blood_group: Joi.string().optional().allow(null, ""),
});

const updateStudentValidation = Joi.object({
  full_name: Joi.string().optional(),
  student_type: Joi.string()
    .valid("school", "coaching")
    .optional()
    .messages({
      "any.only": "student_type must be either school or coaching",
    }),
  gender: Joi.string().valid("male", "female", "other").optional(),
  date_of_birth: Joi.date().optional(),
  blood_group: Joi.string().optional().allow(null, ""),
  status: Joi.string()
    .valid("active", "inactive", "blocked", "archived")
    .optional(),
});

module.exports = {
  createStudentValidation,
  updateStudentValidation,
};