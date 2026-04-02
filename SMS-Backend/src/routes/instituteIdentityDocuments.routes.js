// src/routes/institute_identity_documents.routes.js

const express = require("express");
const router = express.Router();
const identityDocumentsController = require("../controllers/instituteIdentityDocuments.controller");

// All routes are now public - no authentication required
router.get("/", identityDocumentsController.getAllIdentityDocuments);
router.get("/:id", identityDocumentsController.getIdentityDocumentById);
router.get(
  "/institute/:institute_id",
  identityDocumentsController.getIdentityDocumentsByInstituteId
);

router.post(
  "/",
  identityDocumentsController.createIdentityDocument
);

router.put(
  "/:id",
  identityDocumentsController.updateIdentityDocument
);

// Verify/Reject document - verified_by comes from request body
router.patch(
  "/:id/verify",
  identityDocumentsController.verifyIdentityDocument
);

router.delete(
  "/:id",
  identityDocumentsController.deleteIdentityDocument
);

module.exports = router;






















































































// // src/routes/institute_identity_documents.routes.js

// const express = require("express");
// const router = express.Router();
// const identityDocumentsController = require("../controllers/instituteIdentityDocuments.controller");
// const { verifyAdminToken } = require("../middlewares/auth");
 
// // Public routes - Anyone can view
// router.get("/", identityDocumentsController.getAllIdentityDocuments);
// router.get("/:id", identityDocumentsController.getIdentityDocumentById);
// router.get(
//   "/institute/:institute_id",
//   identityDocumentsController.getIdentityDocumentsByInstituteId
// );

// // Protected routes - Only authenticated admins
// router.post(
//   "/",
//   // verifyAdminToken,
//   identityDocumentsController.createIdentityDocument
// );

// router.put(
//   "/:id", 
//   // verifyAdminToken,
//   identityDocumentsController.updateIdentityDocument
// );

// router.patch(
//   "/:id/verify",
//   verifyAdminToken, // IMPORTANT: This ensures verified_by works
//   identityDocumentsController.verifyIdentityDocument
// );

// router.delete(
//   "/:id",
//   // verifyAdminToken,
//   identityDocumentsController.deleteIdentityDocument
// );

// module.exports = router;

