const express = require("express");
const router = express.Router();
const examController = require("../controllers/examsMaster.controller");

// ============= EXAMS MASTER =============

// Create exam
router.post("/", examController.createExam);

// Get all exams with filters
router.get("/", examController.getAllExams);

// Get exam by ID
router.get("/:id", examController.getExamById);

// Update exam
router.put("/:id", examController.updateExam);

// Delete exam
router.delete("/:id", examController.deleteExam);

module.exports = router;
