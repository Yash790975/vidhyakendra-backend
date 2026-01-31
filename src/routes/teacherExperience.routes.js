// src/routes/teachers.routes.js

const express = require("express");
const router = express.Router();
const teachersController = require("../controllers/teacherExperience.controller");

// ============= EXPERIENCE =============

router.post("/experience", teachersController.createExperience);

router.get("/experience", teachersController.getAllExperiences);          
router.get("/experience/:id", teachersController.getExperienceById);      
router.get(
  "/experience/teacher/:teacher_id",
  teachersController.getExperiencesByTeacherId
);

router.put("/experience/:id", teachersController.updateExperience);
router.delete("/experience/:id", teachersController.deleteExperience);


module.exports = router;  