const express = require("express");
const router = express.Router();
const studentFeeController = require("../controllers/studentFee.controller");

// ============= STUDENT FEES =============

// Get all student fees (supports query filters: institute_id, student_id, academic_year, class_id, status)
router.get("/student-fee", studentFeeController.getAllStudentFees);

// Get student fees by student ID (supports query filters: academic_year, status)
router.get(
  "/student-fee/student/:student_id",
  studentFeeController.getStudentFeesByStudentId
);

// Get student fee by ID
router.get("/student-fee/:id", studentFeeController.getStudentFeeById);

// Create student fee manually
router.post("/student-fee", studentFeeController.createStudentFee);

// Generate student fee for a term (auto-reads fee_structure, applies frequency logic)
router.post(
  "/student-fee/generate",
  studentFeeController.generateStudentFeeForTerm
);

// Update student fee
router.put("/student-fee/:id", studentFeeController.updateStudentFee);

// Apply late fee to a student fee record
router.patch(
  "/student-fee/:id/apply-late-fee",
  studentFeeController.applyLateFee
);

// Delete student fee
router.delete("/student-fee/:id", studentFeeController.deleteStudentFee);

module.exports = router;
