const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/homeworkSubmissions.controller");
const { uploadHomeworkSubmission } = require("../middlewares/homeworkUploads.middleware");

// ============= HOMEWORK SUBMISSIONS =============

// Create homework submission with attachments
router.post(
  "/",
  uploadHomeworkSubmission.array("attachments", 10),
  submissionController.createHomeworkSubmission
);

// Get all homework submissions with filters
router.get("/", submissionController.getAllHomeworkSubmissions);

// Get homework submission by ID
router.get("/:id", submissionController.getHomeworkSubmissionById);

// Update homework submission (add more attachments)
router.put(
  "/:id",
  uploadHomeworkSubmission.array("attachments", 10),
  submissionController.updateHomeworkSubmission
);

// Evaluate homework submission
router.patch("/:id/evaluate", submissionController.evaluateHomeworkSubmission);

// Delete single attachment
router.delete("/:id/attachment", submissionController.deleteAttachment);

// Delete homework submission
router.delete("/:id", submissionController.deleteHomeworkSubmission);

module.exports = router;
