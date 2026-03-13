const express = require("express");
const router = express.Router();
const assessmentAnswersController = require("../controllers/assessmentAnswers.controller");

// Save or update a student answer (upsert — safe to call multiple times)
router.post("/", assessmentAnswersController.saveAnswer);

// Get all answers for an attempt (with question details populated)
router.get("/attempt/:attempt_id", assessmentAnswersController.getAnswersByAttempt);

// Teacher manually evaluates a specific short answer
router.put("/:id/evaluate", assessmentAnswersController.evaluateAnswer);

module.exports = router;
