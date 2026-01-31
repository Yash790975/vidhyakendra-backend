const express = require("express");
const router = express.Router();
const studentsController = require("../controllers/studentContactInformation.controller");

// ============= CONTACT INFORMATION =============
router.post("/contact", studentsController.createContact);
router.post("/contact/verify-otp", studentsController.verifyOTP);
router.post("/contact/resend-otp", studentsController.resendOTP);

// Get single contact (first one found) - kept for backward compatibility
router.get("/contact/:student_id", studentsController.getContactByStudentId);

// Get all contacts for a student
router.get("/contacts/:student_id", studentsController.getAllContactsByStudentId);

// Get primary contact for a student
router.get("/contact/primary/:student_id", studentsController.getPrimaryContactByStudentId);

// Update contact by contact ID
router.put("/contact/:id", studentsController.updateContact);

// Get all students contacts with filters
router.get("/contact", studentsController.getAllStudentsContacts);

// Delete contact by contact ID
router.delete("/contact/:id", studentsController.deleteContact);

module.exports = router;







































// const express = require("express");
// const router = express.Router();
// const studentsController = require("../controllers/studentContactInformation.controller");

// // ============= CONTACT INFORMATION =============
// router.post("/contact", studentsController.createContact);
// router.post("/contact/verify-otp", studentsController.verifyOTP);
// router.post("/contact/resend-otp", studentsController.resendOTP);
// router.get("/contact/:student_id", studentsController.getContactByStudentId);
// router.put("/contact/:student_id", studentsController.updateContact);
// router.get("/contact", studentsController.getAllStudentsContacts);
// router.delete("/contact/:student_id", studentsController.deleteContact);

// module.exports = router; 