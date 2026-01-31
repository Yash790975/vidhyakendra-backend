const express = require("express"); 
const router = express.Router();
const instituteDocumentsController = require("../controllers/instituteDocuments.controller");
const { uploadDocument } = require("../middlewares/instituteDocuments.upload"); 
const { verifyAdminToken } = require("../middlewares/auth"); 
   
// Public routes - Anyone can view documents 
router.get("/", instituteDocumentsController.getAllDocuments);
router.get("/:id", instituteDocumentsController.getDocumentById);
router.get(
  "/institute/:institute_id", 
  instituteDocumentsController.getDocumentsByInstituteId
);

// Protected routes - Only authenticated admins can perform these actions
// Create a new document (with file upload) - Admin only
router.post(
  "/",
  // verifyAdminToken,
  uploadDocument.single("file"),
  instituteDocumentsController.createDocument
);

// Update document (with optional file update) - Admin only
router.put(
  "/:id",
  // verifyAdminToken,
  uploadDocument.single("file"),
  instituteDocumentsController.updateDocument
);

// Verify/Reject document - Admin only (THIS IS THE IMPORTANT ONE FOR YOUR ISSUE)
router.patch(
  "/:id/verify",
  verifyAdminToken, 
  instituteDocumentsController.verifyDocument
);

// Delete document - Admin only
router.delete(
  "/:id",
  // verifyAdminToken, 
  instituteDocumentsController.deleteDocument
);

module.exports = router;
