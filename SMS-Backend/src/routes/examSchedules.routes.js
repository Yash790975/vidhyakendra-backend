const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/examSchedules.controller");

// ============= EXAM SCHEDULES =============

// Create exam schedule
router.post("/", scheduleController.createExamSchedule);

// Get all exam schedules with filters
router.get("/", scheduleController.getAllExamSchedules);

// Get exam schedule by ID
router.get("/:id", scheduleController.getExamScheduleById);

// Get exam schedules by exam ID
router.get("/exam/:exam_id", scheduleController.getExamSchedulesByExamId);

// Update exam schedule
router.put("/:id", scheduleController.updateExamSchedule);

// Delete exam schedule
router.delete("/:id", scheduleController.deleteExamSchedule);

module.exports = router;
