const StudentAcademicDocuments = require("../models/studentAcademicDocuments.model");
const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// ============= STUDENT ACADEMIC DOCUMENTS =============

const createStudentAcademicDocument = async (documentData, fileUrl) => {
  const academicDoc = new StudentAcademicDocuments({
    student_id: documentData.student_id,
    document_type: documentData.document_type,
    academic_year: documentData.academic_year || null,
    previous_school_name: documentData.previous_school_name || null,
    previous_board: documentData.previous_board || null,
    class_completed: documentData.class_completed || null,
    file_url: fileUrl,
    verification_status: "pending",
    remarks: documentData.remarks || null,
  });

  await academicDoc.save();
  return academicDoc.toObject();
};

const updateStudentAcademicDocument = async (documentId, updateData, newFileUrl = null) => {
  const document = await StudentAcademicDocuments.findById(documentId);

  if (!document) {
    throw new CustomError("Student academic document not found", statusCode.NOT_FOUND);
  }

  // Delete old file if new file is uploaded
  if (newFileUrl && document.file_url) {
    const oldFilePath = path.join(
      require("../middlewares/upload").UPLOADS_ROOT,
      "student_academic_documents",
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

const deleteStudentAcademicDocument = async (documentId) => {
  const document = await StudentAcademicDocuments.findById(documentId);

  if (!document) {
    throw new CustomError("Student academic document not found", statusCode.NOT_FOUND);
  }

  // Delete file
  if (document.file_url) {
    const filePath = path.join(
      require("../middlewares/upload").UPLOADS_ROOT,
      "student_academic_documents",
      path.basename(document.file_url)
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  await StudentAcademicDocuments.findByIdAndDelete(documentId);
  return document.toObject();
};

const verifyStudentAcademicDocument = async (documentId, verificationData) => {
  const document = await StudentAcademicDocuments.findById(documentId);

  if (!document) {
    throw new CustomError("Student academic document not found", statusCode.NOT_FOUND);
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
  const result = await StudentAcademicDocuments.findById(documentId)
    .populate("student_id", "full_name student_code")
    .populate({
      path: "verified_by",
      model: "institute_admins",
      select: "name email"
    });

  return result;
};

const getStudentAcademicDocumentsByStudentId = async (studentId) => {
  const documents = await StudentAcademicDocuments.find({
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

const getAllStudentAcademicDocuments = async () => {
  const documents = await StudentAcademicDocuments.find()
    .populate("student_id", "full_name student_code")
    .populate({
      path: "verified_by",
      model: "institute_admins",
      select: "name email"
    })
    .sort({ createdAt: -1 });

  return documents;
};

const getStudentAcademicDocumentById = async (documentId) => {
  const document = await StudentAcademicDocuments.findById(documentId)
    .populate("student_id", "full_name student_code")
    .populate({
      path: "verified_by",
      model: "institute_admins",
      select: "name email"
    });

  if (!document) {
    throw new CustomError("Student academic document not found", statusCode.NOT_FOUND);
  }

  return document;
};

module.exports = {
  createStudentAcademicDocument,
  getStudentAcademicDocumentsByStudentId,
  getAllStudentAcademicDocuments,
  getStudentAcademicDocumentById,
  updateStudentAcademicDocument,
  verifyStudentAcademicDocument,
  deleteStudentAcademicDocument,
};
