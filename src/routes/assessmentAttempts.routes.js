const express = require("express");
const router = express.Router();
const assessmentAttemptsController = require("../controllers/assessmentAttempts.controller");

// Start a new attempt
// Body must include institute_type: "school" | "coaching"
// School  → class_id required, batch_id must be null
// Coaching → batch_id required, class_id/section_id must be null
router.post("/start", assessmentAttemptsController.startAttempt);

// Submit attempt — triggers auto-evaluation for MCQ
router.put("/:id/submit", assessmentAttemptsController.submitAttempt);

// Mark attempt as fully evaluated (after short answer review)
router.put("/:id/evaluate", assessmentAttemptsController.markAttemptEvaluated);

// Get all attempts for a specific assessment — teacher view
// Filters: student_id, status, section_id, batch_id
router.get("/assessment/:assessment_id", assessmentAttemptsController.getAttemptsByAssessment);

// Get all attempts by a specific student
// Filters: status, assessment_id, institute_type
router.get("/student/:student_id", assessmentAttemptsController.getAttemptsByStudent);

// Get attempt by ID
router.get("/:id", assessmentAttemptsController.getAttemptById);

module.exports = router;




















































// const express = require("express");
// const router = express.Router();
// const assessmentAttemptsController = require("../controllers/assessmentAttempts.controller");

// // Start a new attempt — student opens the test
// router.post("/start", assessmentAttemptsController.startAttempt);
  
// // Submit attempt — triggers auto-evaluation for MCQ questions 
// router.put("/:id/submit", assessmentAttemptsController.submitAttempt);

// // Mark attempt as fully evaluated by teacher (after short answer review)
// router.put("/:id/evaluate", assessmentAttemptsController.markAttemptEvaluated);

// // Get attempt by ID
// router.get("/:id", assessmentAttemptsController.getAttemptById);

// // Get all attempts for a specific assessment — teacher view
// // Supports filters: student_id, status, section_id, batch_id
// router.get("/assessment/:assessment_id", assessmentAttemptsController.getAttemptsByAssessment);

// // Get all attempts by a specific student
// // Supports filters: status, assessment_id
// router.get("/student/:student_id", assessmentAttemptsController.getAttemptsByStudent);

// module.exports = router;
