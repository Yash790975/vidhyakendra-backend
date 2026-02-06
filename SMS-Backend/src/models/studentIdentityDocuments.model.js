const mongoose = require("mongoose");

const studentIdentityDocumentsSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      // ref: "students_master",    
      ref: "StudentsMaster",    
      required: true,
    },
    document_type: {
      type: String,
      required: true, 
      enum: [
        "birth_certificate",
        "aadhaar_card",
        "pan_card",
        "passport",
        "student_photo"
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
      ref: "institute_admins",
    },
    remarks: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "student_identity_documents"
  }
);

// Compound unique index - one document type per student
studentIdentityDocumentsSchema.index(
  { student_id: 1, document_type: 1 },
  { unique: true }
);

// Index for quick filtering by verification status
studentIdentityDocumentsSchema.index({ verification_status: 1 });

module.exports = mongoose.model(
  "StudentIdentityDocuments",
  studentIdentityDocumentsSchema
);
