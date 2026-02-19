const express = require("express");
const router = express.Router();
const homeworkController = require("../controllers/homeworkAssignments.controller");
const { uploadHomeworkAssignment } = require("../middlewares/homeworkUploads.middleware");

// ============= HOMEWORK ASSIGNMENTS =============

// Create homework assignment with attachments
router.post(
  "/",
  uploadHomeworkAssignment.array("attachments", 10),
  homeworkController.createHomeworkAssignment
);

// Get all homework assignments with filters
router.get("/", homeworkController.getAllHomeworkAssignments);

// Get homework assignment by ID
router.get("/:id", homeworkController.getHomeworkAssignmentById);

// Get homework assignments by class
router.get("/class/:class_id", homeworkController.getHomeworkByClass);

// Update homework assignment (add more attachments)
router.put(
  "/:id",
  uploadHomeworkAssignment.array("attachments", 10),
  homeworkController.updateHomeworkAssignment
);

// Delete single attachment
router.delete("/:id/attachment", homeworkController.deleteAttachment);

// Delete homework assignment
router.delete("/:id", homeworkController.deleteHomeworkAssignment);

module.exports = router;
