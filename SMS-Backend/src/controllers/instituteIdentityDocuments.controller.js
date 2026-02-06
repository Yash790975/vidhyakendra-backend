// src/controllers/institute_identity_documents.controller.js

const identityDocumentsService = require("../services/instituteIdentityDocuments.service");
const statusCode = require("../enums/statusCode");
const {  
  createIdentityDocumentValidation,  
  updateIdentityDocumentValidation,
  verifyIdentityDocumentValidation,
} = require("../validations/instituteIdentityDocuments.validation");

// Create identity document
const createIdentityDocument = async (req, res) => {
  try {
    const { error, value } = createIdentityDocumentValidation.validate(
      req.body
    );
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const document = await identityDocumentsService.createIdentityDocument(
      value
    );

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: document,
      message: "Identity document created successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to create identity document",
    });
  }
};

// Get all identity documents with optional filters
const getAllIdentityDocuments = async (req, res) => {
  try {
    const filters = {
      institute_id: req.query.institute_id,
      document_type: req.query.document_type,
      verification_status: req.query.verification_status,
    };

    const documents = await identityDocumentsService.getAllIdentityDocuments(
      filters
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

// Get identity document by ID
const getIdentityDocumentById = async (req, res) => {
  try {
    const includeDecrypted = req.query.decrypt === "true";

    const document = await identityDocumentsService.getIdentityDocumentById(
      req.params.id,
      includeDecrypted
    );

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

// Get identity documents by institute ID
const getIdentityDocumentsByInstituteId = async (req, res) => {
  try {
    const documents =
      await identityDocumentsService.getIdentityDocumentsByInstituteId(
        req.params.institute_id
      );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: documents,
      message: "Institute identity documents retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve institute identity documents",
    });
  }
};

// Update identity document
const updateIdentityDocument = async (req, res) => {
  try {
    const { error, value } = updateIdentityDocumentValidation.validate(
      req.body
    );
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const document = await identityDocumentsService.updateIdentityDocument(
      req.params.id,
      value
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: document,
      message: "Identity document updated successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to update identity document",
    });
  }
};

// Verify/Reject identity document - NOW USING verified_by FROM REQUEST BODY
const verifyIdentityDocument = async (req, res) => {
  try {
    // Validate request body (includes verified_by)
    const { error, value } = verifyIdentityDocumentValidation.validate(
      req.body
    );
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    // verified_by is now coming from req.body (validated above)
    const verificationData = {
      verification_status: value.verification_status,
      verified_by: value.verified_by,  // Admin ObjectId from request body
      rejection_reason: value.rejection_reason
    };

    const document = await identityDocumentsService.verifyIdentityDocument(
      req.params.id,
      verificationData
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: document,
      message: `Identity document ${value.verification_status} successfully`,
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

// Delete identity document
const deleteIdentityDocument = async (req, res) => {
  try {
    const document = await identityDocumentsService.deleteIdentityDocument(
      req.params.id
    );

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

module.exports = {
  createIdentityDocument,
  getAllIdentityDocuments,
  getIdentityDocumentById,
  getIdentityDocumentsByInstituteId,
  updateIdentityDocument,
  verifyIdentityDocument,
  deleteIdentityDocument,
};










































































// // src/controllers/institute_identity_documents.controller.js

// const identityDocumentsService = require("../services/instituteIdentityDocuments.service");
// const statusCode = require("../enums/statusCode");
// const {  
//   createIdentityDocumentValidation,  
//   updateIdentityDocumentValidation,
//   verifyIdentityDocumentValidation,
// } = require("../validations/instituteIdentityDocuments.validation");

// // Create identity document
// const createIdentityDocument = async (req, res) => {
//   try {
//     // Validate request body
//     const { error, value } = createIdentityDocumentValidation.validate(
//       req.body
//     );
//     if (error) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: {},
//         message: error.details[0].message,
//       });
//     }

//     const document = await identityDocumentsService.createIdentityDocument(
//       value
//     );

//     res.status(statusCode.CREATED).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.CREATED,
//       result: document,
//       message: "Identity document created successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to create identity document",
//     });
//   }
// };

// // Get all identity documents with optional filters
// const getAllIdentityDocuments = async (req, res) => {
//   try {
//     const filters = {
//       institute_id: req.query.institute_id,
//       document_type: req.query.document_type,
//       verification_status: req.query.verification_status,
//     };

//     const documents = await identityDocumentsService.getAllIdentityDocuments(
//       filters
//     );

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: documents,
//       message: "Identity documents retrieved successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to retrieve identity documents",
//     });
//   }
// };

// // Get identity document by ID
// const getIdentityDocumentById = async (req, res) => {
//   try {
//     // Check if user wants decrypted number (admin only)
//     const includeDecrypted = req.query.decrypt === "true";

//     const document = await identityDocumentsService.getIdentityDocumentById(
//       req.params.id,
//       includeDecrypted
//     );

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: document,
//       message: "Identity document retrieved successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to retrieve identity document",
//     });
//   }
// };

// // Get identity documents by institute ID
// const getIdentityDocumentsByInstituteId = async (req, res) => {
//   try {
//     const documents =
//       await identityDocumentsService.getIdentityDocumentsByInstituteId(
//         req.params.institute_id
//       );

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: documents,
//       message: "Institute identity documents retrieved successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to retrieve institute identity documents",
//     });
//   }
// };

// // Update identity document
// const updateIdentityDocument = async (req, res) => {
//   try {
//     // Validate request body
//     const { error, value } = updateIdentityDocumentValidation.validate(
//       req.body
//     );
//     if (error) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: {},
//         message: error.details[0].message,
//       });
//     }

//     const document = await identityDocumentsService.updateIdentityDocument(
//       req.params.id,
//       value
//     );

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: document,
//       message: "Identity document updated successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to update identity document",
//     });
//   }
// };

// // Verify/Reject identity document
// const verifyIdentityDocument = async (req, res) => {
//   try {
//     // Validate request body
//     const { error, value } = verifyIdentityDocumentValidation.validate(
//       req.body
//     );
//     if (error) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: {},
//         message: error.details[0].message,
//       });
//     }

//     // ADDED: Check if admin is authenticated
//     if (!req.admin || !req.admin._id) {
//       return res.status(statusCode.UNAUTHORIZED).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.UNAUTHORIZED,
//         result: {},
//         message: "Admin authentication required",
//       });
//     }

//     // ADDED: Include verified_by in verification data
//     const verificationData = {
//       ...value,
//       verified_by: req.admin._id  // Get admin ID from authenticated request
//     };

//     const document = await identityDocumentsService.verifyIdentityDocument(
//       req.params.id,
//       verificationData  // Pass the enhanced data
//     );

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: document,
//       message: `Identity document ${value.verification_status} successfully`,
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to verify identity document",
//     });
//   }
// };

// // Delete identity document
// const deleteIdentityDocument = async (req, res) => {
//   try {
//     const document = await identityDocumentsService.deleteIdentityDocument(
//       req.params.id
//     );

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK, 
//       result: document,
//       message: "Identity document deleted successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to delete identity document",
//     });
//   }
// };

// module.exports = {
//   createIdentityDocument,
//   getAllIdentityDocuments,
//   getIdentityDocumentById,
//   getIdentityDocumentsByInstituteId,
//   updateIdentityDocument,
//   verifyIdentityDocument,
//   deleteIdentityDocument,
// };

