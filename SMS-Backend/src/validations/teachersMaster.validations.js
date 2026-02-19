const Joi = require("joi");

// Teachers Master Validation
const createTeacherValidation = Joi.object({
  institute_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) 
    .required()   
    .messages({
      "string.pattern.base": "Invalid institute_id format",
      "any.required": "institute_id is required",
    }),
  teacher_type: Joi.string()
    .valid("school", "coaching")
    .required()
    .messages({
      "any.only": "teacher_type must be either school or coaching",
      "any.required": "teacher_type is required",
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
  marital_status: Joi.string()
    .valid("single", "married", "divorced", "widowed")
    .optional(),
  spouse_name: Joi.string().optional().allow(null, ""),
  employment_type: Joi.string()
    .valid("full_time", "part_time", "contract", "visiting")
    .required()
    .messages({
      "any.only":
        "employment_type must be full_time, part_time, contract, or visiting",
      "any.required": "employment_type is required",
    }),
  joining_date: Joi.date().optional(),
  blood_group: Joi.string().optional().allow(null, ""),
  // institute_name: Joi.string().required().messages({
  //   "any.required": "institute_name is required for teacher code generation",
  // }),
});

const updateTeacherValidation = Joi.object({
  full_name: Joi.string().optional(),
   teacher_type: Joi.string() 
    .valid("school", "coaching")
    // .required() 
    .messages({
      "any.only": "teacher_type must be either school or coaching",
      // "any.required": "teacher_type is required",
    }),
  gender: Joi.string().valid("male", "female", "other").optional(),
  date_of_birth: Joi.date().optional(),      
  marital_status: Joi.string()
    .valid("single", "married", "divorced", "widowed")
    .optional(),
  spouse_name: Joi.string().optional().allow(null, ""),
  employment_type: Joi.string()
    .valid("full_time", "part_time", "contract", "visiting")
    .optional(),
  joining_date: Joi.date().optional(),
  status: Joi.string()
    .valid("active", "inactive", "blocked", "archived")
    .optional(),
  blood_group: Joi.string().optional().allow(null, ""),
});


module.exports = {
  createTeacherValidation, 
  updateTeacherValidation
};