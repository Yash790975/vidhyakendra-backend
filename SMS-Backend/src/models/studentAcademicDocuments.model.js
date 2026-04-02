const mongoose = require("mongoose");

const studentAcademicDocumentsSchema = new mongoose.Schema(
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
        "transfer_certificate",
        "leaving_certificate",
        "marksheet",
        "migration_certificate",
        "bonafide_certificate",
        "character_certificate"
      ],
    },
    academic_year: {
      type: String,
      default: null,
    },
    previous_school_name: {
      type: String,
      default: null,
    },
    previous_board: {
      type: String,
      enum: ["CBSE", "ICSE", "STATE", "IB", "OTHER", null],
      default: null,
    },
    class_completed: {
      type: String,
      default: null,
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
    collection: "student_academic_documents"
  }
);

// Index for filtering by student and document type
studentAcademicDocumentsSchema.index({ student_id: 1, document_type: 1 });

// Index for quick filtering by verification status
studentAcademicDocumentsSchema.index({ verification_status: 1 });

module.exports = mongoose.model(
  "StudentAcademicDocuments",
  studentAcademicDocumentsSchema
);
