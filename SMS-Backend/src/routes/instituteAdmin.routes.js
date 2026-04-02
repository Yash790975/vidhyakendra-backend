// routes/instituteAdmin.routes.js
const express = require('express');
const router = express.Router();
const instituteAdminController = require('../controllers/instituteAdmin.controller');
      
// Admin CRUD operations
router.post('/create', instituteAdminController.createAdmin);
router.get('/get-all', instituteAdminController.getAllAdmins);
router.get('/get/:id', instituteAdminController.getAdminById);
router.get('/get-by-institute/:instituteId', instituteAdminController.getAdminByInstituteId);
router.put('/update/:id', instituteAdminController.updateAdmin);
router.delete('/delete/:id', instituteAdminController.deleteAdmin);   

// Authentication operations
router.post('/verify-login', instituteAdminController.verifyLogin);
router.post('/request-otp', instituteAdminController.requestOTP);
router.post('/verify-otp', instituteAdminController.verifyOTP);
router.post('/change-password', instituteAdminController.changePassword);
router.post('/reset-password', instituteAdminController.resetPassword);

// Get admins by institute type
router.get('/get-by-type/:type', instituteAdminController.getAdminsByInstituteType);

module.exports = router;