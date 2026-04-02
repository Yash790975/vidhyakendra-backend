const express = require("express");
const router = express.Router();
const studentsController = require("../controllers/studentIdentityDocuments.controller");
const {
  uploadStudentIdentityDocument
} = require("../middlewares/studentUploads.middleware");

// ============= STUDENT IDENTITY DOCUMENTS =============

// Get identity documents by student ID
router.get(
  "/identity-document/student/:student_id",
  studentsController.getStudentIdentityDocumentsByStudentId
);

// Create identity document
router.post(
  "/identity-document",
  uploadStudentIdentityDocument.single("file"),
  studentsController.createStudentIdentityDocument
);

// Update identity document
router.put(
  "/identity-document/:id",
  uploadStudentIdentityDocument.single("file"),
  studentsController.updateStudentIdentityDocument
);

// Verify identity document (approve/reject)
router.patch(
  "/identity-document/:id/verify",
  studentsController.verifyStudentIdentityDocument
);

// Delete identity document
router.delete(
  "/identity-document/:id",
  studentsController.deleteStudentIdentityDocument
);

// Get all identity documents (Admin)
router.get(
  "/identity-document",
  studentsController.getAllStudentIdentityDocuments
);

// Get identity document by ID (Admin)
router.get(
  "/identity-document/:id",
  studentsController.getStudentIdentityDocumentById
);

module.exports = router;
