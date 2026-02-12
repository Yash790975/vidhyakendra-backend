const express = require('express');
const router = express.Router();
const studentAuthController = require('../controllers/studentAuth.controller');
   
// Student Auth CRUD operations    
router.post('/create', studentAuthController.createStudentAuth);
router.get('/get-all', studentAuthController.getAllStudentAuths);
router.get('/get/:id', studentAuthController.getStudentAuthById);
router.get('/get-by-student/:studentId', studentAuthController.getStudentAuthByStudentId);
router.get('/get-by-username/:username', studentAuthController.getStudentAuthByUsername);
router.put('/update/:id', studentAuthController.updateStudentAuth);
router.delete('/delete/:id', studentAuthController.deleteStudentAuth);

// Authentication operations
router.post('/verify-login', studentAuthController.verifyLogin);
router.post('/request-otp', studentAuthController.requestOTP);
router.post('/verify-otp', studentAuthController.verifyOTP);
router.post('/change-password', studentAuthController.changePassword);
router.post('/reset-password', studentAuthController.resetPassword);

module.exports = router;













































































// const express = require("express");
// const router = express.Router();
// const studentAuthController = require("../controllers/studentAuth.controller");

// // ============= STUDENT AUTHENTICATION =============

// // Create student auth (registration)
// router.post("/", studentAuthController.createStudentAuth);

// // Login
// router.post("/login", studentAuthController.login);   

// // Change password (by student)
// router.post("/change-password/:student_id", studentAuthController.changePassword);

// // Reset password (by admin)
// router.post("/reset-password", studentAuthController.resetPassword);

// // Get auth by student ID
// router.get("/:student_id", studentAuthController.getAuthByStudentId);

// // Get all student auths with filters
// router.get("/", studentAuthController.getAllStudentAuths);

// // Update status (block/activate)
// router.patch("/status/:student_id", studentAuthController.updateStatus);

// // Delete auth
// router.delete("/:student_id", studentAuthController.deleteAuth);

// module.exports = router;