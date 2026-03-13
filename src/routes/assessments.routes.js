const express = require("express");
const router = express.Router();
const assessmentsController = require("../controllers/assessments.controller");

// Create assessment
router.post("/", assessmentsController.createAssessment);

// Get all assessments (supports filters: institute_id, class_id, section_id,
// batch_id, subject_id, created_by, status, assessment_type, academic_year, available_now)
router.get("/", assessmentsController.getAllAssessments);

// Get assessment by ID
router.get("/:id", assessmentsController.getAssessmentById);

// Get assessment analytics — teacher dashboard view
router.get("/:id/analytics", assessmentsController.getAssessmentAnalytics);

// Update assessment
router.put("/:id", assessmentsController.updateAssessment);

// Delete assessment (cascades to questions, attempts, and answers)
router.delete("/:id", assessmentsController.deleteAssessment);

module.exports = router;
