const Joi = require("joi");

const optionSchema = Joi.object({
  option_id: Joi.string().required().messages({
    "any.required": "option_id is required",
  }),
  option_text: Joi.string().required().messages({
    "any.required": "option_text is required",
  }),
});

const createAssessmentQuestionValidation = Joi.object({
  institute_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid institute_id format",
      "any.required": "institute_id is required",
    }),
  assessment_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid assessment_id format",
      "any.required": "assessment_id is required",
    }),
  question_text: Joi.string().required().messages({
    "any.required": "question_text is required",
  }),
  question_type: Joi.string()
    .valid("mcq", "short_answer")
    .required()
    .messages({
      "any.only": "question_type must be mcq or short_answer",
      "any.required": "question_type is required",
    }),
  options: Joi.array().items(optionSchema).optional().allow(null),
  correct_options: Joi.array().items(Joi.string()).optional().allow(null),
  correct_answer_text: Joi.string().optional().allow(null, ""),
  marks: Joi.number().integer().required().messages({
    "any.required": "marks is required",
  }),
  hint: Joi.string().optional().allow(null, ""),
  explanation: Joi.string().optional().allow(null, ""),
  order: Joi.number().integer().required().messages({
    "any.required": "order is required",
  }),
});

const updateAssessmentQuestionValidation = Joi.object({
  question_text: Joi.string().optional(),
  question_type: Joi.string().valid("mcq", "short_answer").optional(),
  options: Joi.array().items(optionSchema).optional().allow(null),
  correct_options: Joi.array().items(Joi.string()).optional().allow(null),
  correct_answer_text: Joi.string().optional().allow(null, ""),
  marks: Joi.number().integer().optional(),
  hint: Joi.string().optional().allow(null, ""),
  explanation: Joi.string().optional().allow(null, ""),
  order: Joi.number().integer().optional(),
});

module.exports = {
  createAssessmentQuestionValidation,
  updateAssessmentQuestionValidation,
};
