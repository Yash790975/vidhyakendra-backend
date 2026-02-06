const studentsService = require("../services/studentAcademicDocuments.service");
const statusCode = require("../enums/statusCode");
const {
  createStudentAcademicDocValidation,
  updateStudentAcademicDocValidation,
  verifyStudentAcademicDocValidation,
} = require("../validations/studentAcademicDocuments.validations");
const path = require("path");
const fs = require("fs");
const { UPLOADS_ROOT } = require("../middlewares/upload");
const mongoose = require("mongoose");

// ============= STUDENT ACADEMIC DOCUMENTS =============

const createStudentAcademicDocument = async (req, res) => {
  try {
    const { error, value } = createStudentAcademicDocValidation.validate(req.body);
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

    const fileUrl = `/uploads/student_academic_documents/${req.file.filename}`;

    const document = await studentsService.createStudentAcademicDocument(value, fileUrl);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: document,
      message: "Student academic document created successfully",
    });
  } catch (err) {
    if (req.file) {
      const filePath = path.join(
        UPLOADS_ROOT,
        "student_academic_documents",
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
      message: err.message || "Failed to create student academic document",
    });
  }
};

const getStudentAcademicDocumentsByStudentId = async (req, res) => {
  try {
    const documents = await studentsService.getStudentAcademicDocumentsByStudentId(
      req.params.student_id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: documents,
      message: "Student academic documents retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve student academic documents",
    });
  }
};

const updateStudentAcademicDocument = async (req, res) => {
  try {
    const { error, value } = updateStudentAcademicDocValidation.validate(req.body);
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
      newFileUrl = `/uploads/student_academic_documents/${req.file.filename}`;
    }

    const document = await studentsService.updateStudentAcademicDocument(
      req.params.id,
      value,
      newFileUrl
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: document,
      message: "Student academic document updated successfully",
    });
  } catch (err) {
    if (req.file) {
      const filePath = path.join(
        UPLOADS_ROOT,
        "student_academic_documents",
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
      message: err.message || "Failed to update student academic document",
    });
  }
};

const deleteStudentAcademicDocument = async (req, res) => {
  try {
    const document = await studentsService.deleteStudentAcademicDocument(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: document,
      message: "Student academic document deleted successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to delete student academic document",
    });
  }
};

const verifyStudentAcademicDocument = async (req, res) => {
  try {
    const { error, value } = verifyStudentAcademicDocValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const document = await studentsService.verifyStudentAcademicDocument(
      req.params.id,
      value
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: document,
      message: `Student academic document ${value.verification_status} successfully`,
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to verify student academic document",
    });
  }
};

const getAllStudentAcademicDocuments = async (req, res) => {
  try {
    const documents = await studentsService.getAllStudentAcademicDocuments();

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: documents,
      message: "All student academic documents retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve student academic documents",
    });
  }
};

const getStudentAcademicDocumentById = async (req, res) => {
  try {
    const document = await studentsService.getStudentAcademicDocumentById(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: document,
      message: "Student academic document retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve student academic document",
    });
  }
};

module.exports = {
  createStudentAcademicDocument,
  getStudentAcademicDocumentsByStudentId,
  getAllStudentAcademicDocuments,
  getStudentAcademicDocumentById,
  updateStudentAcademicDocument,
  deleteStudentAcademicDocument,
  verifyStudentAcademicDocument,
};
