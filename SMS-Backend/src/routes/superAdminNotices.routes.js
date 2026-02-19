const express = require("express");
const router = express.Router();
const noticeController = require("../controllers/superAdminNotices.controller");
const { uploadSuperAdminNotice } = require("../middlewares/noticeUploads.middleware");

// ============= SUPER ADMIN NOTICES =============
router.post("/", uploadSuperAdminNotice.single("file"), noticeController.createNotice);
router.get("/", noticeController.getAllNotices);
router.get("/expired", noticeController.getExpiredNotices);
router.get("/published", noticeController.getPublishedNotices);
router.get("/:id", noticeController.getNoticeById);
router.get("/institute/:institute_id", noticeController.getNoticesForInstitute);
router.put("/:id", uploadSuperAdminNotice.single("file"), noticeController.updateNotice);
router.patch("/:id/publish", noticeController.publishNotice);
router.patch("/:id/archive", noticeController.archiveNotice);
router.delete("/:id", noticeController.deleteNotice);

module.exports = router;






























// const express = require("express");
// const router = express.Router();
// const noticeController = require("../controllers/superAdminNotices.controller");

// // ============= SUPER ADMIN NOTICES =============
// router.post("/", noticeController.createNotice);
// router.get("/", noticeController.getAllNotices);
// router.get("/published", noticeController.getPublishedNotices);
// router.get("/:id", noticeController.getNoticeById);
// router.get("/institute/:institute_id", noticeController.getNoticesForInstitute);
// router.put("/:id", noticeController.updateNotice);
// router.patch("/:id/publish", noticeController.publishNotice);
// router.patch("/:id/archive", noticeController.archiveNotice);
// router.delete("/:id", noticeController.deleteNotice);

// module.exports = router; 