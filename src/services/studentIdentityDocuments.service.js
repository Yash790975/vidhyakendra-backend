const StudentIdentityDocuments = require("../models/studentIdentityDocuments.model");
const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// ============= STUDENT IDENTITY DOCUMENTS =============

const createStudentIdentityDocument = async (documentData, fileUrl) => {
  // Check if document already exists
  const existing = await StudentIdentityDocuments.findOne({
    student_id: documentData.student_id,
    document_type: documentData.document_type,
  });

  if (existing) {
    throw new CustomError(
      `${documentData.document_type} already exists for this student`,
      statusCode.CONFLICT
    );
  }

  const identityDoc = new StudentIdentityDocuments({
    student_id: documentData.student_id,
    document_type: documentData.document_type,
    file_url: fileUrl,
    verification_status: "pending",
    remarks: documentData.remarks || null,
  });

  await identityDoc.save();
  return identityDoc.toObject();
};

const updateStudentIdentityDocument = async (documentId, updateData, newFileUrl = null) => {
  const document = await StudentIdentityDocuments.findById(documentId);

  if (!document) {
    throw new CustomError("Student identity document not found", statusCode.NOT_FOUND);
  }

  // Delete old file if new file is uploaded
  if (newFileUrl && document.file_url) {
    const oldFilePath = path.join(
      require("../middlewares/upload").UPLOADS_ROOT,
      "student_identity_documents",
      path.basename(document.file_url)
    );

    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }
  }

  if (newFileUrl) {
    document.file_url = newFileUrl;
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      document[key] = updateData[key];
    }
  });

  await document.save();
  return document.toObject();
};

const deleteStudentIdentityDocument = async (documentId) => {
  const document = await StudentIdentityDocuments.findById(documentId);

  if (!document) {
    throw new CustomError("Student identity document not found", statusCode.NOT_FOUND);
  }

  // Delete file
  if (document.file_url) {
    const filePath = path.join(
      require("../middlewares/upload").UPLOADS_ROOT,
      "student_identity_documents",
      path.basename(document.file_url)
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  await StudentIdentityDocuments.findByIdAndDelete(documentId);
  return document.toObject();
};

const verifyStudentIdentityDocument = async (documentId, verificationData) => {
  const document = await StudentIdentityDocuments.findById(documentId);

  if (!document) {
    throw new CustomError("Student identity document not found", statusCode.NOT_FOUND);
  }

  // Verify that the institute admin exists
  const InstituteAdmin = mongoose.model("institute_admins");
  const adminExists = await InstituteAdmin.findById(verificationData.verified_by);

  if (!adminExists) {
    throw new CustomError("Institute admin not found", statusCode.NOT_FOUND);
  }

  document.verification_status = verificationData.verification_status;
  document.verified_by = verificationData.verified_by;

  if (verificationData.remarks) {
    document.remarks = verificationData.remarks;
  }

  await document.save();

  // Populate and return
  const result = await StudentIdentityDocuments.findById(documentId)
    .populate("student_id", "full_name student_code")
    .populate({
      path: "verified_by",
      model: "institute_admins",
      select: "name email"
    });

  return result;
};

const getStudentIdentityDocumentsByStudentId = async (studentId) => {
  const documents = await StudentIdentityDocuments.find({
    student_id: studentId,
  })
    .populate("student_id", "full_name student_code")
    .populate({
      path: "verified_by",
      model: "institute_admins",
      select: "name email"
    })
    .sort({ createdAt: -1 });

  return documents;
};

const getAllStudentIdentityDocuments = async () => {
  const documents = await StudentIdentityDocuments.find()
    .populate("student_id", "full_name student_code")
    .populate({
      path: "verified_by",
      model: "institute_admins",
      select: "name email"
    })
    .sort({ createdAt: -1 });

  return documents;
};

const getStudentIdentityDocumentById = async (documentId) => {
  const document = await StudentIdentityDocuments.findById(documentId)
    .populate("student_id", "full_name student_code")
    .populate({
      path: "verified_by",
      model: "institute_admins",
      select: "name email"
    });

  if (!document) {
    throw new CustomError("Student identity document not found", statusCode.NOT_FOUND);
  }

  return document;
};

module.exports = {
  createStudentIdentityDocument,
  getStudentIdentityDocumentsByStudentId,
  getAllStudentIdentityDocuments,
  getStudentIdentityDocumentById,
  updateStudentIdentityDocument,
  verifyStudentIdentityDocument,
  deleteStudentIdentityDocument,
};
