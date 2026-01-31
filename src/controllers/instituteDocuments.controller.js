

// src/controllers/institute_documents.controller.js 

const instituteDocumentsService = require("../services/instituteDocuments.service");
const statusCode = require("../enums/statusCode");
const {
  createDocumentValidation,  
  updateDocumentValidation,
  verifyDocumentValidation,
} = require("../validations/instituteDocuments.validation.js");
const path = require("path");
const fs = require("fs");
const { UPLOADS_ROOT } = require("../middlewares/upload");

// Helper function to generate unique filename
const generateUniqueFilename = (instituteName, documentType) => {
  const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
  const cleanName = instituteName.toLowerCase().replace(/[^a-z0-9]/g, "_");
  const cleanType = documentType.toLowerCase().replace(/[^a-z0-9]/g, "_");
  return `${cleanName}_${cleanType}_${randomNum}`;
};

// Create institute document
const createDocument = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = createDocumentValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    // Check if file is uploaded
    if (!req.file) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: "Document file is required",
      });
    } 

    // Create file URL
    const fileUrl = `/uploads/institute_documents/${req.file.filename}`;
    // const fileUrl = `/uploads/instituteDocuments/${req.file.filename}`;

    const documentData = {
      ...value,
      file_url: fileUrl,
      verification_status: "pending",
    };

    const document = await instituteDocumentsService.createDocument(
      documentData
    );

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: document,
      message: "Document created successfully",
    });
  } catch (err) {
    // Delete uploaded file if error occurs
    if (req.file) {
      const filePath = path.join(
        UPLOADS_ROOT,
        "institute_documents",
        // "instituteDocuments",
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
      message: err.message || "Failed to create document",
    });
  }
};

// Get all documents with optional filters
const getAllDocuments = async (req, res) => {
  try {
    const filters = {
      institute_id: req.query.institute_id,
      document_type: req.query.document_type,
      verification_status: req.query.verification_status,
    };

    const documents = await instituteDocumentsService.getAllDocuments(filters);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: documents,
      message: "Documents retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve documents",
    });
  }
};

// Get document by ID
const getDocumentById = async (req, res) => {
  try {
    const document = await instituteDocumentsService.getDocumentById(
      req.params.id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: document,
      message: "Document retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve document",
    });
  }
};

// Get documents by institute ID
const getDocumentsByInstituteId = async (req, res) => {
  try {
    const documents = await instituteDocumentsService.getDocumentsByInstituteId(
      req.params.institute_id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: documents,
      message: "Institute documents retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve institute documents",
    });
  }
};

// Update document
const updateDocument = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = updateDocumentValidation.validate(req.body);
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
      newFileUrl = `/uploads/institute_documents/${req.file.filename}`;
      // newFileUrl = `/uploads/instituteDocuments/${req.file.filename}`;
    }

    const document = await instituteDocumentsService.updateDocument(
      req.params.id,
      value,
      newFileUrl
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: document,
      message: "Document updated successfully",
    });
  } catch (err) {
    // Delete uploaded file if error occurs
    if (req.file) {
      const filePath = path.join(
        UPLOADS_ROOT,
        "institute_documents",
        // "instituteDocuments",
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
      message: err.message || "Failed to update document", 
    });
  }
};

// Verify/Reject document
// Verify/Reject document
const verifyDocument = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = verifyDocumentValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    // Check if admin is authenticated
    if (!req.admin || !req.admin._id) {
      return res.status(statusCode.UNAUTHORIZED).json({
        success: false,
        isException: false,
        statusCode: statusCode.UNAUTHORIZED,
        result: {},
        message: "Admin authentication required",
      }); 
    }

    // Add verified_by to the verification data
    const verificationData = {
      ...value,
      verified_by: req.admin._id  // ADD THIS LINE - Get admin ID from authenticated request
    };

    const document = await instituteDocumentsService.verifyDocument(
      req.params.id,
      verificationData  // Pass the enhanced data
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: document,
      message: `Document ${value.verification_status} successfully`,
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to verify document",
    });
  }
};

// Delete document
const deleteDocument = async (req, res) => {
  try {
    const document = await instituteDocumentsService.deleteDocument(
      req.params.id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: document,
      message: "Document deleted successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to delete document",
    });
  }
};

module.exports = {
  createDocument,
  getAllDocuments,
  getDocumentById,
  getDocumentsByInstituteId,
  updateDocument,
  verifyDocument,
  deleteDocument,
};

