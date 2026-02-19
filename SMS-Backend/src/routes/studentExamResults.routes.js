const express = require("express");
const router = express.Router();
const resultController = require("../controllers/studentExamResults.controller");

// ============= STUDENT EXAM RESULTS =============

// Create student exam result
router.post("/", resultController.createStudentExamResult);

// Get all student exam results with filters
router.get("/", resultController.getAllStudentExamResults);

// Get student exam result by ID
router.get("/:id", resultController.getStudentExamResultById);

// Get results by student ID
router.get("/student/:student_id", resultController.getResultsByStudentId);

// Get results by exam schedule ID
router.get("/exam-schedule/:exam_schedule_id", resultController.getResultsByExamSchedule);

// Update student exam result
router.put("/:id", resultController.updateStudentExamResult);

// Delete student exam result
router.delete("/:id", resultController.deleteStudentExamResult);

module.exports = router;
