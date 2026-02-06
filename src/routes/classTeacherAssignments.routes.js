const express = require("express");
const router = express.Router();
const assignmentsController = require("../controllers/classTeacherAssignments.controller");

// ============= CLASS TEACHER ASSIGNMENTS =============

// Create assignment
router.post("/", assignmentsController.createAssignment);

// Get all assignments with filters
router.get("/", assignmentsController.getAllAssignments);

// Get assignment by ID
router.get("/:id", assignmentsController.getAssignmentById);

// Get assignments by teacher
router.get("/teacher/:teacher_id", assignmentsController.getAssignmentsByTeacherId);

// Get assignments by class
router.get("/class/:class_id", assignmentsController.getAssignmentsByClassId);

// Get assignments by role
router.get("/role/:role", assignmentsController.getAssignmentsByRole);

// Get subject teachers for a specific subject
router.get("/subject/:subject_id", assignmentsController.getSubjectTeachers);

// Update assignment
router.put("/:id", assignmentsController.updateAssignment);

// End assignment (set assigned_to and mark inactive)
router.patch("/:id/end", assignmentsController.endAssignment);

// Delete assignment
router.delete("/:id", assignmentsController.deleteAssignment);

module.exports = router;