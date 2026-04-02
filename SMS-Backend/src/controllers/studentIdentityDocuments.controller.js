const studentsService = require("../services/studentIdentityDocuments.service");
const statusCode = require("../enums/statusCode");
const {
  createStudentIdentityDocValidation,
  updateStudentIdentityDocValidation,
  verifyStudentIdentityDocValidation,
} = require("../validations/studentIdentityDocuments.validations");
const path = require("path");
const fs = require("fs");
const { UPLOADS_ROOT } = require("../middlewares/upload");
const mongoose = require("mongoose");

// ============= STUDENT IDENTITY DOCUMENTS =============

const createStudentIdentityDocument = async (req, res) => {
  try {
    const { error, value } = createStudentIdentityDocValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    if (!req.file) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: "Document file is required",
      });
    }

    const fileUrl = `/uploads/student_identity_documents/${req.file.filename}`;

    const document = await studentsService.createStudentIdentityDocument(value, fileUrl);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: document,
      message: "Student identity document created successfully",
    });
  } catch (err) {
    if (req.file) {
      const filePath = path.join(
        UPLOADS_ROOT,
        "student_identity_documents",
        req.file.filename
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to create student identity document",
    });
  }
};

const getStudentIdentityDocumentsByStudentId = async (req, res) => {
  try {
    const documents = await studentsService.getStudentIdentityDocumentsByStudentId(
      req.params.student_id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: documents,
      message: "Student identity documents retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve student identity documents",
    });
  }
};

const updateStudentIdentityDocument = async (req, res) => {
  try {
    const { error, value } = updateStudentIdentityDocValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    let newFileUrl = null;
    if (req.file) {
      newFileUrl = `/uploads/student_identity_documents/${req.file.filename}`;
    }

    const document = await studentsService.updateStudentIdentityDocument(
      req.params.id,
      value,
      newFileUrl
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: document,
      message: "Student identity document updated successfully",
    });
  } catch (err) {
    if (req.file) {
      const filePath = path.join(
        UPLOADS_ROOT,
        "student_identity_documents",
        req.file.filename
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to update student identity document",
    });
  }
};

const deleteStudentIdentityDocument = async (req, res) => {
  try {
    const document = await studentsService.deleteStudentIdentityDocument(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: document,
      message: "Student identity document deleted successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to delete student identity document",
    });
  }
};

const verifyStudentIdentityDocument = async (req, res) => {
  try {
    const { error, value } = verifyStudentIdentityDocValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const document = await studentsService.verifyStudentIdentityDocument(
      req.params.id,
      value
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: document,
      message: `Student identity document ${value.verification_status} successfully`,
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to verify student identity document",
    });
  }
};

const getAllStudentIdentityDocuments = async (req, res) => {
  try {
    const documents = await studentsService.getAllStudentIdentityDocuments();

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: documents,
      message: "All student identity documents retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve student identity documents",
    });
  }
};

const getStudentIdentityDocumentById = async (req, res) => {
  try {
    const document = await studentsService.getStudentIdentityDocumentById(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: document,
      message: "Student identity document retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve student identity document",
    });
  }
};

module.exports = {
  createStudentIdentityDocument,
  getStudentIdentityDocumentsByStudentId,
  getAllStudentIdentityDocuments,
  getStudentIdentityDocumentById,
  updateStudentIdentityDocument,
  deleteStudentIdentityDocument,
  verifyStudentIdentityDocument,
};
