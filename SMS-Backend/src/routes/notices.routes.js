const express = require("express");
const router = express.Router();
const noticeController = require("../controllers/notices.controller");

// ============= INSTITUTE NOTICES =============
router.post("/", noticeController.createNotice);
router.get("/", noticeController.getAllNotices);
router.get("/:id", noticeController.getNoticeById);
router.get(
  "/student/:student_id/institute/:institute_id",
  noticeController.getNoticesForStudent
);
router.get(
  "/teacher/:teacher_id/institute/:institute_id",
  noticeController.getNoticesForTeacher
);
router.get(
  "/class/:class_id/institute/:institute_id",
  noticeController.getNoticesForClass
);
router.put("/:id", noticeController.updateNotice);
router.patch("/:id/publish", noticeController.publishNotice);
router.patch("/:id/archive", noticeController.archiveNotice);
router.delete("/:id", noticeController.deleteNotice);

module.exports = router;