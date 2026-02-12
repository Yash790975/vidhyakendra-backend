const express = require("express");
const router = express.Router();
const studentsController = require("../controllers/studentsMaster.controller");

// ============= STUDENTS MASTER =============
router.post("/", studentsController.createStudent);
router.get("/", studentsController.getAllStudents);
router.get("/:id", studentsController.getStudentById);
router.get("/code/:code", studentsController.getStudentByCode);
router.put("/:id", studentsController.updateStudent);
router.delete("/:id", studentsController.deleteStudent);
  
module.exports = router;