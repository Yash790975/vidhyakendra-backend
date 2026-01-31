// src/models/institute_identity_documents.model.js

const mongoose = require("mongoose");

const instituteIdentityDocumentSchema = new mongoose.Schema(
  {
    institute_id: {
      type: mongoose.Schema.Types.ObjectId,
      // ref: "Institute", 
      ref: "institutes_master",
      required: true,
    },
    document_type: {
      type: String,
      required: true,
      enum: ["aadhaar", "pan"],
    },
    document_number: {
      type: String,
      required: true,
      description: "Encrypted value",
    },
    masked_number: {
      type: String,
      description: "XXXX-XXXX-1234 format", 
    },
    verification_status: {
      type: String,
      required: true,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    verified_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    rejection_reason: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection:"institute_identity_documents" 
  }
);

// Compound unique index - one document type per institute
instituteIdentityDocumentSchema.index(
  { institute_id: 1, document_type: 1 },
  { unique: true }
);

// Index for faster queries
instituteIdentityDocumentSchema.index({ verification_status: 1 });

module.exports = mongoose.model(
  "InstituteIdentityDocument",
  instituteIdentityDocumentSchema
);