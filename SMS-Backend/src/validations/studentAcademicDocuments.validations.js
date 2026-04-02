const Joi = require("joi");

// Student Academic Document Validation
const createStudentAcademicDocValidation = Joi.object({
  student_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "student_id must be a valid MongoDB ObjectId",
      "any.required": "student_id is required",
    }),
  document_type: Joi.string()
    .valid(
      "transfer_certificate",
      "leaving_certificate",
      "marksheet",
      "migration_certificate",
      "bonafide_certificate",
      "character_certificate"
    )
    .required()
    .messages({
      "any.only": "document_type must be one of: transfer_certificate, leaving_certificate, marksheet, migration_certificate, bonafide_certificate, character_certificate",
      "any.required": "document_type is required",
    }),
  student_name: Joi.string()
    .required()
    .messages({
      "any.required": "student_name is required for filename generation",
    }),
  academic_year: Joi.string().optional().allow(""),
  previous_school_name: Joi.string().optional().allow(""),
  previous_board: Joi.string()
    .valid("CBSE", "ICSE", "STATE", "IB", "OTHER")
    .optional()
    .allow(""),
  class_completed: Joi.string().optional().allow(""),
  remarks: Joi.string().optional().allow(""),
});

// Update Student Academic Document Validation
const updateStudentAcademicDocValidation = Joi.object({
  academic_year: Joi.string().optional().allow(""),
  previous_school_name: Joi.string().optional().allow(""),
  previous_board: Joi.string()
    .valid("CBSE", "ICSE", "STATE", "IB", "OTHER")
    .optional()
    .allow(""),
  class_completed: Joi.string().optional().allow(""),
  remarks: Joi.string().optional().allow(""),
  verification_status: Joi.string()
    .valid("pending", "approved", "rejected")
    .optional(),
});

// Verify Student Academic Document Validation
const verifyStudentAcademicDocValidation = Joi.object({
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
  createStudentAcademicDocValidation,
  updateStudentAcademicDocValidation,
  verifyStudentAcademicDocValidation,
};
