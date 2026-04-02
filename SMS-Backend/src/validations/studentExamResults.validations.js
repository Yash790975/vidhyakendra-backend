const Joi = require("joi");

const createStudentExamResultValidation = Joi.object({
  exam_schedule_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid exam_schedule_id format",
      "any.required": "exam_schedule_id is required",
    }),
  student_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid student_id format",
      "any.required": "student_id is required",
    }),
  theory_marks_obtained: Joi.number().optional().allow(null),
  practical_marks_obtained: Joi.number().optional().allow(null),
  total_marks_obtained: Joi.number().optional().allow(null),
  total_marks: Joi.number().optional().allow(null),
  percentage: Joi.number().optional().allow(null),
  grade: Joi.string().optional().allow(null, ""),
  rank: Joi.number().optional().allow(null),
  remarks: Joi.string().optional().allow(null, ""),
  is_absent: Joi.boolean().optional().allow(null),
  is_pass: Joi.boolean().optional().allow(null),
  evaluated_by: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, ""),
  evaluated_by_role: Joi.string()
    .valid("institute_admin", "teacher")
    .optional()
    .allow(null, ""),
});

const updateStudentExamResultValidation = Joi.object({
  theory_marks_obtained: Joi.number().optional().allow(null),
  practical_marks_obtained: Joi.number().optional().allow(null),
  total_marks_obtained: Joi.number().optional().allow(null),
  total_marks: Joi.number().optional().allow(null),
  percentage: Joi.number().optional().allow(null),
  grade: Joi.string().optional().allow(null, ""),
  rank: Joi.number().optional().allow(null),
  remarks: Joi.string().optional().allow(null, ""),
  is_absent: Joi.boolean().optional().allow(null),
  is_pass: Joi.boolean().optional().allow(null),
  evaluated_by: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, ""),
  evaluated_by_role: Joi.string()
    .valid("institute_admin", "teacher")
    .optional()
    .allow(null, ""),
});

module.exports = {
  createStudentExamResultValidation,
  updateStudentExamResultValidation,
};
