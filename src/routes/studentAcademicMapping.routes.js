const express = require("express");
const router = express.Router();
const mappingController = require("../controllers/studentAcademicMapping.controller");

// ============= STUDENT ACADEMIC MAPPING =============

// Create mapping
router.post("/", mappingController.createMapping);

// Get all mappings with filters
router.get("/", mappingController.getAllMappings);

// Get mapping by ID
router.get("/:id", mappingController.getMappingById);

// Get active mappings for a student
router.get(
  "/student/:student_id/active",
  mappingController.getActiveStudentMappings
);

// Get mapping history for a student
router.get(
  "/student/:student_id/history",
  mappingController.getStudentMappingHistory
);

// Get students by class (with optional section filter)
router.get("/class/:class_id/students", mappingController.getStudentsByClass);

// Get students by batch (for coaching)
router.get("/batch/:batch_id/students", mappingController.getStudentsByBatch);

// Update mapping
router.put("/:id", mappingController.updateMapping);

// Promote student
router.patch("/:id/promote", mappingController.promoteStudent);

// Delete mapping
router.delete("/:id", mappingController.deleteMapping);

module.exports = router;