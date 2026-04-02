const Joi = require("joi");

const createHomeworkSubmissionValidation = Joi.object({
  homework_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid homework_id format",
      "any.required": "homework_id is required",
    }),
  student_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid student_id format",
      "any.required": "student_id is required",
    }),
  submission_text: Joi.string().optional().allow(null, ""),
  status: Joi.string()
    .valid("pending", "submitted", "evaluated", "late_submission")
    .optional()
    .default("pending"),
});

const updateHomeworkSubmissionValidation = Joi.object({
  submission_text: Joi.string().optional().allow(null, ""),
  status: Joi.string()
    .valid("pending", "submitted", "evaluated", "late_submission")
    .optional(),
});

const evaluateHomeworkValidation = Joi.object({
  marks_obtained: Joi.number().required().messages({
    "any.required": "marks_obtained is required for evaluation",
  }),
  feedback: Joi.string().optional().allow(null, ""),
  evaluated_by: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid evaluated_by format",
      "any.required": "evaluated_by (Teacher ID) is required",
    }),
});

module.exports = {
  createHomeworkSubmissionValidation,
  updateHomeworkSubmissionValidation,
  evaluateHomeworkValidation,
};
