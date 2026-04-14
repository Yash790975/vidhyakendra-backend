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
