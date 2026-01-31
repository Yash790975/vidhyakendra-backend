const express = require("express");
const router = express.Router();
const teachersController = require("../controllers/teacherIdentityDocuments.controller");
const {
  uploadIdentityDocument
} = require("../middlewares/teacherUploads.middleware");
const { verifyInstituteAdminToken } = require("../middlewares/instituteAdminAuth"); // ADD THIS


// ============= IDENTITY DOCUMENTS =============

// Public route - Get identity documents by teacher ID
// router.get(
//   "/identity-document/:teacher_id",
//   teachersController.getIdentityDocumentsByTeacherId
// );
router.get("/identity-document/teacher/:teacher_id", teachersController.getIdentityDocumentsByTeacherId);

// Protected routes - Require institute admin authentication
router.post( 
  "/identity-document",
  // verifyInstituteAdminToken, // ADD AUTH
  uploadIdentityDocument.single("file"),
  teachersController.createIdentityDocument
);

router.put(
  "/identity-document/:id",
  // verifyInstituteAdminToken, // ADD AUTH
  uploadIdentityDocument.single("file"),
  teachersController.updateIdentityDocument
);


router.patch(
  "/identity-document/:id/verify",
  verifyInstituteAdminToken, 
  teachersController.verifyIdentityDocument
);

router.delete(
  "/identity-document/:id",
  // verifyInstituteAdminToken, 
  teachersController.deleteIdentityDocument 
);


// Admin
router.get(
  "/identity-document",
  // verifyInstituteAdminToken,
  teachersController.getAllIdentityDocuments
);

router.get(
  "/identity-document/:id",
  // verifyInstituteAdminToken,
  teachersController.getIdentityDocumentById 
);


module.exports = router;






















































// const express = require("express");
// const router = express.Router();
// const teachersController = require("../controllers/teacherIdentityDocuments.controller");
// const {
//   uploadIdentityDocument
// } = require("../middlewares/teacherUploads.middleware");


// // ============= IDENTITY DOCUMENTS =============
// router.post( 
//   "/identity-document",
//   uploadIdentityDocument.single("file"),
//   teachersController.createIdentityDocument
// );
// router.get(
//   "/identity-document/:teacher_id",
//   teachersController.getIdentityDocumentsByTeacherId
// );
// router.put(
//   "/identity-document/:id",
//   uploadIdentityDocument.single("file"),
//   teachersController.updateIdentityDocument
// );
// router.delete(
//   "/identity-document/:id",
//   teachersController.deleteIdentityDocument
// );


// module.exports = router;