const express = require("express");
const router = express.Router();
const assignmentsController = require("../controllers/classTeacherAssignments.controller");

router.post("/", assignmentsController.createAssignment);
router.get("/", assignmentsController.getAllAssignments);

router.get("/teacher/:teacher_id", assignmentsController.getAssignmentsByTeacherId);
router.get("/class/:class_id", assignmentsController.getAssignmentsByClassId);
router.get("/class/:class_id/class-teacher", assignmentsController.getClassTeacherByClassId);
router.get("/role/:role", assignmentsController.getAssignmentsByRole);
router.get("/subject/:subject_id", assignmentsController.getSubjectTeachers);
router.get("/batch/:batch_id/incharge", assignmentsController.getBatchInchargeByBatchId);  //  NEW

router.put("/:id", assignmentsController.updateAssignment);
router.patch("/:id/end", assignmentsController.endAssignment);
router.delete("/:id", assignmentsController.deleteAssignment);
router.get("/:id", assignmentsController.getAssignmentById);

module.exports = router;












































































// const express = require("express");
// const router = express.Router();
// const assignmentsController = require("../controllers/classTeacherAssignments.controller");

// // ============= CLASS TEACHER ASSIGNMENTS =============

// // Create assignment
// router.post("/", assignmentsController.createAssignment);

// // Get all assignments with filters  
// router.get("/", assignmentsController.getAllAssignments);

// // Get assignments by teacher
// router.get("/teacher/:teacher_id", assignmentsController.getAssignmentsByTeacherId);

// // Get assignments by class
// router.get("/class/:class_id", assignmentsController.getAssignmentsByClassId);

// //  Get class teacher by class (direct or section-wise)
// // Optional query params: ?section_id=X  →  filter to a specific section
// //                        ?academic_year=2024-25
// router.get("/class/:class_id/class-teacher", assignmentsController.getClassTeacherByClassId);

// // Get assignments by role
// router.get("/role/:role", assignmentsController.getAssignmentsByRole);

// // Get subject teachers for a specific subject
// router.get("/subject/:subject_id", assignmentsController.getSubjectTeachers);

// // Update assignment
// router.put("/:id", assignmentsController.updateAssignment);

// // End assignment (set assigned_to and mark inactive)
// router.patch("/:id/end", assignmentsController.endAssignment);

// // Delete assignment
// router.delete("/:id", assignmentsController.deleteAssignment);

// // Get assignment by ID  ← kept last, /:id is a catch-all
// router.get("/:id", assignmentsController.getAssignmentById);

// module.exports = router;

