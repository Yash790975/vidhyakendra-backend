const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/classSubjectSchedule.controller");

// ============= CLASS SUBJECT SCHEDULE =============
router.post("/", scheduleController.createSchedule);
router.get("/", scheduleController.getAllSchedules);

router.get("/class/:class_id", scheduleController.getScheduleByClassId);
router.get("/teacher/:teacher_id", scheduleController.getScheduleByTeacherId);
router.get("/batch/:batch_id", scheduleController.getScheduleByBatchId);  

router.put("/:id", scheduleController.updateSchedule);
router.delete("/:id", scheduleController.deleteSchedule);
router.get("/:id", scheduleController.getScheduleById);     // keep last — catch-all

module.exports = router;