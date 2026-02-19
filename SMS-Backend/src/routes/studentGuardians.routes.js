 const express = require("express");
const router = express.Router();
const guardianController = require("../controllers/studentGuardians.controller");

// ============= STUDENT GUARDIANS =============
router.post("/", guardianController.createGuardian);
router.get("/", guardianController.getAllGuardians);
router.get("/:id", guardianController.getGuardianById);
router.get("/student/:student_id", guardianController.getGuardiansByStudentId);
router.get("/student/:student_id/primary", guardianController.getPrimaryGuardian);
router.put("/:id", guardianController.updateGuardian);
router.delete("/:id", guardianController.deleteGuardian);

module.exports = router;