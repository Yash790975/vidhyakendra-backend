const express = require('express');
const validate = require("../middlewares/validation.middleware");
const adminController = require("../controllers/admin.controller");     
const { 
  addAdmin, 
  updateAdmin, 
  getAdminById,        
  removeAdmin, 
  verifyLogin, 
  requestOTP, 
  verifyOTP, 
  changePassword 
} = require("../validations/admin.validation");

const router = express.Router();


router.post('/add', validate(addAdmin), adminController.add);

router.post('/update', validate(updateAdmin), adminController.update);

router.get('/getById/:id', validate(getAdminById), adminController.getById);

router.get('/getAll', adminController.getAll);

router.delete('/:id', validate(removeAdmin), adminController.remove); 

router.post('/login', validate(verifyLogin), adminController.verifyLogin);

router.post('/request-otp', validate(requestOTP), adminController.requestOTP);

router.post('/verify-otp', validate(verifyOTP), adminController.verifyOTP);

router.post('/change-password', validate(changePassword), adminController.changePassword);

module.exports = router;