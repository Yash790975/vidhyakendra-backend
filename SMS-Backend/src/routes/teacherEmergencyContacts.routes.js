const express = require("express");
const router = express.Router();
const teachersController = require("../controllers/teacherEmergencyContacts.controller");
// ============= EMERGENCY CONTACTS =============
router.post("/emergency-contact", teachersController.createEmergencyContact);
router.get("/emergency-contact", teachersController.getAllEmergencyContacts);            
router.get("/emergency-contact/id/:id", teachersController.getEmergencyContactById);    
router.get("/emergency-contact/:teacher_id", teachersController.getEmergencyContactsByTeacherId);
router.put("/emergency-contact/:id", teachersController.updateEmergencyContact);
router.delete("/emergency-contact/:id", teachersController.deleteEmergencyContact);


module.exports = router;  