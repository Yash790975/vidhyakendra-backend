// src/validations/institute_identity_documents.validation.js

const Joi = require("joi");

// Aadhaar validation: 12 digits 
const aadhaarPattern = /^[0-9]{12}$/;

// PAN validation: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)
const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

const createIdentityDocumentValidation = Joi.object({
  institute_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid institute_id format",
      "any.required": "institute_id is required",
    }),
  document_type: Joi.string()
    .valid("aadhaar", "pan")
    .required()
    .messages({
      "any.only": "document_type must be either aadhaar or pan",
      "any.required": "document_type is required",
    }),
  document_number: Joi.string()
    .required()
    .custom((value, helpers) => {
      const documentType = helpers.state.ancestors[0].document_type;
      
      if (documentType === "aadhaar") {
        // Remove spaces and validate Aadhaar
        const cleanValue = value.replace(/\s/g, "");
        if (!aadhaarPattern.test(cleanValue)) {
          return helpers.error("any.invalid");
        }
        return cleanValue;
      } else if (documentType === "pan") {
        // Validate PAN (uppercase)
        const upperValue = value.toUpperCase();
        if (!panPattern.test(upperValue)) {
          return helpers.error("any.invalid");
        }
        return upperValue;
      }
      
      return value;
    })
    .messages({
      "any.required": "document_number is required",
      "any.invalid": "Invalid document number format. Aadhaar must be 12 digits, PAN must be in format ABCDE1234F",
    }),
});

const updateIdentityDocumentValidation = Joi.object({
  document_number: Joi.string()
    .optional()
    .custom((value, helpers) => {
      // Get document from database to check type
      // This will be validated in the service layer
      return value;
    }),
  verification_status: Joi.string()
    .valid("pending", "approved", "rejected")
    .optional(),
  verified_by: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "Invalid verified_by format",
    }),
  rejection_reason: Joi.string().optional().allow(""),
});

const verifyIdentityDocumentValidation = Joi.object({
  verification_status: Joi.string()
    .valid("approved", "rejected")
    .required()
    .messages({
      "any.only": "verification_status must be either approved or rejected",
      "any.required": "verification_status is required",
    }),
  verified_by: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid verified_by format",
      "any.required": "verified_by is required",
    }),
  rejection_reason: Joi.string().when("verification_status", {
    is: "rejected",
    then: Joi.required(),
    otherwise: Joi.optional().allow(""),
  }),
});

module.exports = {
  createIdentityDocumentValidation,
  updateIdentityDocumentValidation,
  verifyIdentityDocumentValidation,
};