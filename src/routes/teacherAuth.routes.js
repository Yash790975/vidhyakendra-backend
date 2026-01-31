const express = require('express');
const router = express.Router();
const teacherAuthController = require('../controllers/teacherAuth.controller');
   
// Teacher Auth CRUD operations
router.post('/create', teacherAuthController.createTeacherAuth);
router.get('/get-all', teacherAuthController.getAllTeacherAuths);
router.get('/get/:id', teacherAuthController.getTeacherAuthById);
router.get('/get-by-teacher/:teacherId', teacherAuthController.getTeacherAuthByTeacherId);
router.put('/update/:id', teacherAuthController.updateTeacherAuth);
router.delete('/delete/:id', teacherAuthController.deleteTeacherAuth);

// Authentication operations
router.post('/verify-login', teacherAuthController.verifyLogin);
router.post('/request-otp', teacherAuthController.requestOTP);
router.post('/verify-otp', teacherAuthController.verifyOTP);
router.post('/change-password', teacherAuthController.changePassword);
router.post('/reset-password', teacherAuthController.resetPassword);

module.exports = router; 