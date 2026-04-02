const express = require("express");
const router = express.Router();
const sectionsController = require("../controllers/classSections.controller");

// ============= CLASS SECTIONS =============
router.post("/", sectionsController.createSection);
router.get("/", sectionsController.getAllSections);
router.get("/:id", sectionsController.getSectionById);
router.get("/class/:class_id", sectionsController.getSectionsByClassId);
router.put("/:id", sectionsController.updateSection);
router.delete("/:id", sectionsController.deleteSection);

module.exports = router;