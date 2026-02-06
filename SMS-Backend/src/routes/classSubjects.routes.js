const express = require("express");
const router = express.Router();
const classSubjectsController = require("../controllers/classSubjects.controller");

// ============= CLASS SUBJECTS =============
router.post("/", classSubjectsController.createClassSubject);
router.get("/", classSubjectsController.getAllClassSubjects);
router.get("/:id", classSubjectsController.getClassSubjectById);
router.get("/class/:class_id", classSubjectsController.getSubjectsByClassId);
router.put("/:id", classSubjectsController.updateClassSubject);
router.delete("/:id", classSubjectsController.deleteClassSubject);

module.exports = router;