const express = require("express");
const router = express.Router();
const classesController = require("../controllers/classesMaster.controller");

// ============= CLASSES MASTER =============
router.post("/", classesController.createClass);
router.get("/", classesController.getAllClasses);
router.get("/:id", classesController.getClassById);
router.put("/:id", classesController.updateClass);
router.delete("/:id", classesController.deleteClass); 
router.get(
  "/institute/:institute_id/year/:academic_year",
  classesController.getClassesByInstituteAndYear
);

module.exports = router;