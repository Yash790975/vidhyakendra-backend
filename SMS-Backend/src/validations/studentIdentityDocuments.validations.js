const Joi = require("joi");

// Student Identity Document Validation
const createStudentIdentityDocValidation = Joi.object({
  student_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "student_id must be a valid MongoDB ObjectId",
      "any.required": "student_id is required",
    }),
  document_type: Joi.string()
    .valid(
      "birth_certificate",
      "aadhaar_card",
      "pan_card",
      "passport",
      "student_photo"
    )
    .required()
    .messages({
      "any.only": "document_type must be one of: birth_certificate, aadhaar_card, pan_card, passport, student_photo",
      "any.required": "document_type is required",
    }),
  student_name: Joi.string()
    .required()
    .messages({
      "any.required": "student_name is required for filename generation",
    }),
  remarks: Joi.string().optional().allow(""),
});

// Update Student Identity Document Validation
const updateStudentIdentityDocValidation = Joi.object({
  remarks: Joi.string().optional().allow(""),
  verification_status: Joi.string()
    .valid("pending", "approved", "rejected")
    .optional(),
});

// Verify Student Identity Document Validation
const verifyStudentIdentityDocValidation = Joi.object({
  verification_status: Joi.string()
    .valid("approved", "rejected")
    .required()
    .messages({
      "any.only": "verification_status must be either 'approved' or 'rejected'",
      "any.required": "verification_status is required",
    }),
  verified_by: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "verified_by must be a valid MongoDB ObjectId",
      "any.required": "verified_by (Institute Admin ID) is required",
    }),
  remarks: Joi.string().optional().allow(""),
});

module.exports = {
  createStudentIdentityDocValidation,
  updateStudentIdentityDocValidation,
  verifyStudentIdentityDocValidation,
};
