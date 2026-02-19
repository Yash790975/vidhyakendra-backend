const express = require("express");
const router = express.Router();
const teachersController = require("../controllers/teacherContactInformation.controller");

    
// ============= CONTACT INFORMATION =============
router.post("/contact", teachersController.createContact);
router.post("/contact/verify-otp", teachersController.verifyOTP);
router.post("/contact/resend-otp", teachersController.resendOTP);
router.get("/contact/:teacher_id", teachersController.getContactByTeacherId);
router.put("/contact/:teacher_id", teachersController.updateContact);
router.get("/contact", teachersController.getAllTeachersContacts);     
router.delete("/contact/:teacher_id", teachersController.deleteContact);



module.exports = router; 