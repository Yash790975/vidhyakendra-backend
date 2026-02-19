const express = require("express");
const router = express.Router();
const teachersController = require("../controllers/teacherIdentityDocuments.controller");
const {
  uploadIdentityDocument
} = require("../middlewares/teacherUploads.middleware"); 

// ============= IDENTITY DOCUMENTS =============

// Get identity documents by teacher ID
router.get("/identity-document/teacher/:teacher_id", teachersController.getIdentityDocumentsByTeacherId);

// Create identity document
router.post( 
  "/identity-document",
  uploadIdentityDocument.single("file"),
  teachersController.createIdentityDocument
);

// Update identity document
router.put(
  "/identity-document/:id",
  uploadIdentityDocument.single("file"),
  teachersController.updateIdentityDocument
);

// Verify identity document (approve/reject)
router.patch(
  "/identity-document/:id/verify",
  teachersController.verifyIdentityDocument
);

// Delete identity document
router.delete(
  "/identity-document/:id",
  teachersController.deleteIdentityDocument 
);    
// Get all identity documents (Admin)
router.get(
  "/identity-document",
  teachersController.getAllIdentityDocuments
);

// Get identity document by ID (Admin)
router.get(
  "/identity-document/:id",
  teachersController.getIdentityDocumentById 
);

module.exports = router;

