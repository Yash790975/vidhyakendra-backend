const express = require("express");
const router = express.Router();
const assessmentQuestionsController = require("../controllers/assessmentQuestions.controller");

// Add a question to an assessment
router.post("/", assessmentQuestionsController.addQuestion);

// Get all questions for an assessment (sorted by order)
router.get("/assessment/:assessment_id", assessmentQuestionsController.getQuestionsByAssessment);

// Get question by ID
router.get("/:id", assessmentQuestionsController.getQuestionById);

// Update question (also recalculates assessment total_marks)
router.put("/:id", assessmentQuestionsController.updateQuestion);

// Delete question (also recalculates assessment total_marks)
router.delete("/:id", assessmentQuestionsController.deleteQuestion);

module.exports = router;
