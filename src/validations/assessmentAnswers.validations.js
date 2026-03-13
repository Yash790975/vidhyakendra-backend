const Joi = require("joi");

const saveAnswerValidation = Joi.object({
  institute_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid institute_id format",
      "any.required": "institute_id is required",
    }),
  attempt_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid attempt_id format",
      "any.required": "attempt_id is required",
    }),
  assessment_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid assessment_id format",
      "any.required": "assessment_id is required",
    }),
  question_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid question_id format",
      "any.required": "question_id is required",
    }),
  student_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid student_id format",
      "any.required": "student_id is required",
    }),
  selected_options: Joi.array().items(Joi.string()).optional().allow(null),
  answer_text: Joi.string().optional().allow(null, ""),
  is_skipped: Joi.boolean().optional().allow(null),
});

const evaluateAnswerValidation = Joi.object({
  teacher_marks: Joi.number().required().messages({
    "any.required": "teacher_marks is required",
  }),
  teacher_feedback: Joi.string().optional().allow(null, ""),
});

module.exports = {
  saveAnswerValidation,
  evaluateAnswerValidation,
};
