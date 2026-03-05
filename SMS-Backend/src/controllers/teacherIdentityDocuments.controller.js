const teachersService = require("../services/teacherIdentityDocuments.service");
const statusCode = require("../enums/statusCode");
const {
  createIdentityDocValidation     
} = require("../validations/teacherIdentityDocuments.validations");   
const path = require("path"); 
const fs = require("fs");
const { UPLOADS_ROOT } = require("../middlewares/upload");
const mongoose = require("mongoose");

// ============= IDENTITY DOCUMENTS =============

const createIdentityDocument = async (req, res) => {
  try {
    const { error, value } = createIdentityDocValidation.validate(req.body);
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

    const fileUrl = `/uploads/teacher_identity_documents/${req.file.filename}`;

    const document = await teachersService.createIdentityDocument(value, fileUrl);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: document,
      message: "Identity document created successfully",
    });
  } catch (err) {
    if (req.file) {
      const filePath = path.join(
        UPLOADS_ROOT,
        "teacher_identity_documents",
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
      message: err.message || "Failed to create identity document",
    });
  }
};

const getIdentityDocumentsByTeacherId = async (req, res) => {
  try {
    const documents = await teachersService.getIdentityDocumentsByTeacherId(
      req.params.teacher_id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: documents,
      message: "Identity documents retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve identity documents",
    });
  }
};

const updateIdentityDocument = async (req, res) => {
  try {
    let newFileUrl = null;
    if (req.file) {
      newFileUrl = `/uploads/teacher_identity_documents/${req.file.filename}`;
    }

    const document = await teachersService.updateIdentityDocument(
      req.params.id,
      req.body,
      newFileUrl
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: document,
      message: "Identity document updated successfully",
    });
  } catch (err) {
    if (req.file) {
      const filePath = path.join(
        UPLOADS_ROOT,
        "teacher_identity_documents",
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
      message: err.message || "Failed to update identity document",
    });
  }
};

const deleteIdentityDocument = async (req, res) => {
  try {
    const document = await teachersService.deleteIdentityDocument(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: document,
      message: "Identity document deleted successfully",
    }); 
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to delete identity document",
    });
  }
};   

const verifyIdentityDocument = async (req, res) => {
  try {
    // Validate verification_status
    if (!req.body.verification_status || 
        !['approved', 'rejected'].includes(req.body.verification_status)) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: "verification_status must be 'approved' or 'rejected'",
      });
    }

    // Validate verified_by ObjectId
    if (!req.body.verified_by) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: "verified_by (Institute Admin ID) is required",
      });
    }

    // Check if verified_by is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.body.verified_by)) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: "verified_by must be a valid MongoDB ObjectId",
      });
    }

    // Validate rejection_reason if status is rejected
    if (req.body.verification_status === 'rejected' && !req.body.rejection_reason) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: "rejection_reason is required when status is 'rejected'",
      });
    }

    const verificationData = {
      verification_status: req.body.verification_status,
      rejection_reason: req.body.rejection_reason,
      verified_by: req.body.verified_by
    };

    const document = await teachersService.verifyIdentityDocument(
      req.params.id,
      verificationData
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: document,
      message: `Identity document ${verificationData.verification_status} successfully`,
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to verify identity document",
    });
  }
};

const getAllIdentityDocuments = async (req, res) => {
  try {
    const documents = await teachersService.getAllIdentityDocuments();

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: documents,
      message: "All identity documents retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve identity documents",
    });
  }
};

const getIdentityDocumentById = async (req, res) => {
  try {
    const document = await teachersService.getIdentityDocumentById(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: document,
      message: "Identity document retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve identity document",
    });
  }
};

module.exports = {
  createIdentityDocument,
  getIdentityDocumentsByTeacherId,
  getAllIdentityDocuments,
  getIdentityDocumentById,
  updateIdentityDocument,
  deleteIdentityDocument,
  verifyIdentityDocument
};


