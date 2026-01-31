// src/models/institute_documents.model.js

const mongoose = require("mongoose");

const instituteDocumentSchema = new mongoose.Schema(
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
      enum: [
        "registration_certificate",  
        "affiliation_certificate",
        "gst_certificate", 
        "logo",
      ],
    },
    file_url: {
      type: String,
      required: true,
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
    collection: "institute_documents" 
  }
);

// Index for faster queries
instituteDocumentSchema.index({ institute_id: 1, document_type: 1 });
instituteDocumentSchema.index({ verification_status: 1 });

module.exports = mongoose.model("InstituteDocument", instituteDocumentSchema);