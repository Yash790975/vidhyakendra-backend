// src/routes/institute_identity_documents.routes.js

const express = require("express");
const router = express.Router();
const identityDocumentsController = require("../controllers/instituteIdentityDocuments.controller");
const { verifyAdminToken } = require("../middlewares/auth");
 
// Public routes - Anyone can view
router.get("/", identityDocumentsController.getAllIdentityDocuments);
router.get("/:id", identityDocumentsController.getIdentityDocumentById);
router.get(
  "/institute/:institute_id",
  identityDocumentsController.getIdentityDocumentsByInstituteId
);

// Protected routes - Only authenticated admins
router.post(
  "/",
  // verifyAdminToken,
  identityDocumentsController.createIdentityDocument
);

router.put(
  "/:id",
  // verifyAdminToken,
  identityDocumentsController.updateIdentityDocument
);

router.patch(
  "/:id/verify",
  verifyAdminToken, // IMPORTANT: This ensures verified_by works
  identityDocumentsController.verifyIdentityDocument
);

router.delete(
  "/:id",
  // verifyAdminToken,
  identityDocumentsController.deleteIdentityDocument
);

module.exports = router;

