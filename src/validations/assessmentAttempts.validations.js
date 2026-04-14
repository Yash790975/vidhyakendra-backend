const Joi = require("joi");

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

// ─── School attempt ───────────────────────────────────────────────────────────
const startSchoolAttemptValidation = Joi.object({
  institute_id: Joi.string().pattern(objectIdPattern).required().messages({ 
    "string.pattern.base": "Invalid institute_id format",
    "any.required": "institute_id is required",
  }),
  institute_type: Joi.string().valid("school").required(),   //  locked
  assessment_id: Joi.string().pattern(objectIdPattern).required().messages({
    "string.pattern.base": "Invalid assessment_id format",
    "any.required": "assessment_id is required",
  }),
  student_id: Joi.string().pattern(objectIdPattern).required().messages({
    "string.pattern.base": "Invalid student_id format",
    "any.required": "student_id is required",
  }),
  class_id: Joi.string().pattern(objectIdPattern).required().messages({ // required for school
    "string.pattern.base": "Invalid class_id format",
    "any.required": "class_id is required for school attempts",
  }),
  section_id: Joi.string().pattern(objectIdPattern).optional().allow(null, ""),
  batch_id: Joi.any().valid(null, "").optional(),            // must be null for school
});

// ─── Coaching attempt ─────────────────────────────────────────────────────────
const startCoachingAttemptValidation = Joi.object({
  institute_id: Joi.string().pattern(objectIdPattern).required().messages({
    "string.pattern.base": "Invalid institute_id format",
    "any.required": "institute_id is required",
  }),
  institute_type: Joi.string().valid("coaching").required(), //  locked
  assessment_id: Joi.string().pattern(objectIdPattern).required().messages({
    "string.pattern.base": "Invalid assessment_id format",
    "any.required": "assessment_id is required",
  }),
  student_id: Joi.string().pattern(objectIdPattern).required().messages({
    "string.pattern.base": "Invalid student_id format",
    "any.required": "student_id is required",
  }),
  class_id: Joi.any().valid(null, "").optional(),            // must be null for coaching
  section_id: Joi.any().valid(null, "").optional(),          // must be null for coaching
  batch_id: Joi.string().pattern(objectIdPattern).required().messages({ // required for coaching
    "string.pattern.base": "Invalid batch_id format",
    "any.required": "batch_id is required for coaching attempts",
  }),
});

const submitAttemptValidation = Joi.object({});

const evaluateAttemptValidation = Joi.object({
  evaluated_by: Joi.string().pattern(objectIdPattern).required().messages({
    "string.pattern.base": "Invalid evaluated_by format",
    "any.required": "evaluated_by (Teacher ID) is required",
  }),
  remarks: Joi.string().optional().allow(null, ""),
});

module.exports = {
  startSchoolAttemptValidation,
  startCoachingAttemptValidation,
  submitAttemptValidation,
  evaluateAttemptValidation,
};
