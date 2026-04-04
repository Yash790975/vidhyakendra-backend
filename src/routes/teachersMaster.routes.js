const express = require("express");
const router = express.Router();
const teachersController = require("../controllers/teachersMaster.controller"); 
const { uploadTeacherPhoto } = require("../middlewares/teacherUploads.middleware");

// ============= TEACHERS MASTER =============

// Create teacher (with optional profile photo)
router.post("/", uploadTeacherPhoto.single("upload_photo"), teachersController.createTeacher);

// Get all teachers
router.get("/", teachersController.getAllTeachers);
 
// Get teacher with all details
router.get("/teacher-with-all-details/:id", teachersController.getTeacherWithAllDetails);

// Get teacher by ID
router.get("/:id", teachersController.getTeacherById);

// Get teacher by code
router.get("/code/:code", teachersController.getTeacherByCode);

// Update teacher (with optional profile photo replacement)
router.put("/:id", uploadTeacherPhoto.single("upload_photo"), teachersController.updateTeacher);

// Update teacher with all details (no photo — handled separately via PUT /:id)
router.put("/update-with-all-details/:id", teachersController.updateTeacherWithAllDetails);

// Delete teacher
router.delete("/:id", teachersController.deleteTeacher);

module.exports = router;

