const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/classSubjectSchedule.controller");

// ============= CLASS SUBJECT SCHEDULE =============
router.post("/", scheduleController.createSchedule);
router.get("/", scheduleController.getAllSchedules);
router.get("/:id", scheduleController.getScheduleById);
router.get("/class/:class_id", scheduleController.getScheduleByClassId);
router.get("/teacher/:teacher_id", scheduleController.getScheduleByTeacherId);
router.put("/:id", scheduleController.updateSchedule);
router.delete("/:id", scheduleController.deleteSchedule);

module.exports = router;