const express = require("express");
const router = express.Router();
const studentsController = require("../controllers/studentAcademicDocuments.controller");
const {
  uploadStudentAcademicDocument
} = require("../middlewares/studentUploads.middleware");

// ============= STUDENT ACADEMIC DOCUMENTS =============

// Get academic documents by student ID
router.get(
  "/academic-document/student/:student_id",
  studentsController.getStudentAcademicDocumentsByStudentId
);

// Create academic document
router.post(
  "/academic-document",
  uploadStudentAcademicDocument.single("file"),
  studentsController.createStudentAcademicDocument
);

// Update academic document
router.put(
  "/academic-document/:id",
  uploadStudentAcademicDocument.single("file"),
  studentsController.updateStudentAcademicDocument
);

// Verify academic document (approve/reject)
router.patch(
  "/academic-document/:id/verify",
  studentsController.verifyStudentAcademicDocument
);

// Delete academic document
router.delete(
  "/academic-document/:id",
  studentsController.deleteStudentAcademicDocument
);

// Get all academic documents (Admin)
router.get(
  "/academic-document",
  studentsController.getAllStudentAcademicDocuments
);

// Get academic document by ID (Admin)
router.get(
  "/academic-document/:id",
  studentsController.getStudentAcademicDocumentById
);

module.exports = router;
