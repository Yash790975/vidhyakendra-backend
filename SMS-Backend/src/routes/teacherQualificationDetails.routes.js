const express = require("express");
const router = express.Router();
const teachersController = require("../controllers/teacherQualificationDetails.controller");
const {
  uploadQualificationDocument,   
} = require("../middlewares/teacherUploads.middleware"); 

// ============= QUALIFICATIONS =============

router.post(
  "/qualification",
  uploadQualificationDocument.single("file"),
  teachersController.createQualification
);

router.get("/qualification", teachersController.getAllQualifications);          
router.get("/qualification/:id", teachersController.getQualificationById);      
router.get(
  "/qualification/teacher/:teacher_id",
  teachersController.getQualificationsByTeacherId
);

router.put(
  "/qualification/:id",
  uploadQualificationDocument.single("file"),
  teachersController.updateQualification
);

router.delete("/qualification/:id", teachersController.deleteQualification);



module.exports = router;