// src/validations/institute_documents.validation.js

const Joi = require("joi");

const createDocumentValidation = Joi.object({
  institute_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid institute_id format",
      "any.required": "institute_id is required",
    }),
  document_type: Joi.string() 
    .valid(
      "registration_certificate",
      "affiliation_certificate",
      "gst_certificate",
      "logo"
    )
    .required()
    .messages({
      "any.only": "Invalid document_type",
      "any.required": "document_type is required",
    }),
});

const updateDocumentValidation = Joi.object({
  document_type: Joi.string()
    .valid(
      "registration_certificate",
      "affiliation_certificate",
      "gst_certificate",
      "logo"
    )
    .optional(),
  verification_status: Joi.string()
    .valid("pending", "approved", "rejected")
    .optional(),
  rejection_reason: Joi.string().optional().allow(""),
});

const verifyDocumentValidation = Joi.object({
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
      "string.pattern.base": "Invalid verified_by format. Must be a valid ObjectId",
      "any.required": "verified_by is required. Please provide the Admin's ObjectId",
    }),
  rejection_reason: Joi.string().when("verification_status", {
    is: "rejected",
    then: Joi.required(),
    otherwise: Joi.optional().allow(""),
  }),
});

module.exports = {
  createDocumentValidation,
  updateDocumentValidation,
  verifyDocumentValidation,
};




































































// // src/validations/institute_documents.validation.js

// const Joi = require("joi");

// const createDocumentValidation = Joi.object({
//   institute_id: Joi.string()
//     .pattern(/^[0-9a-fA-F]{24}$/)
//     .required()
//     .messages({
//       "string.pattern.base": "Invalid institute_id format",
//       "any.required": "institute_id is required",
//     }),
//   document_type: Joi.string() 
//     .valid(
//       "registration_certificate",
//       "affiliation_certificate",
//       "gst_certificate",
//       "logo"
//     )
//     .required()
//     .messages({
//       "any.only": "Invalid document_type",
//       "any.required": "document_type is required",
//     }),
// });

// const updateDocumentValidation = Joi.object({
//   document_type: Joi.string()
//     .valid(
//       "registration_certificate",
//       "affiliation_certificate",
//       "gst_certificate",
//       "logo"
//     )
//     .optional(),
//   verification_status: Joi.string()
//     .valid("pending", "approved", "rejected")
//     .optional(),
//   verified_by: Joi.string()
//     .pattern(/^[0-9a-fA-F]{24}$/)
//     .optional()
//     .messages({
//       "string.pattern.base": "Invalid verified_by format",
//     }),
//   rejection_reason: Joi.string().optional().allow(""),
// });

// const verifyDocumentValidation = Joi.object({
//   verification_status: Joi.string()
//     .valid("approved", "rejected")
//     .required()
//     .messages({
//       "any.only": "verification_status must be either approved or rejected",
//       "any.required": "verification_status is required",
//     }),
//   verified_by: Joi.string()
//     .pattern(/^[0-9a-fA-F]{24}$/)
//     .required()
//     .messages({
//       "string.pattern.base": "Invalid verified_by format",
//       "any.required": "verified_by is required",
//     }),
//   rejection_reason: Joi.string().when("verification_status", {
//     is: "rejected",
//     then: Joi.required(),
//     otherwise: Joi.optional().allow(""),
//   }),
// });

// module.exports = {
//   createDocumentValidation,
//   updateDocumentValidation,
//   verifyDocumentValidation,
// };