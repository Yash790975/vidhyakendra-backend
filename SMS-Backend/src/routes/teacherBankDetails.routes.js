

const express = require("express");
const router = express.Router(); 
const teachersController = require("../controllers/teacherBankDetails.controller"); 

// ============= BANK DETAILS =============
router.post("/bank-details", teachersController.createBankDetails);
router.get("/bank-details", teachersController.getAllBankDetails);          // NEW
router.get("/bank-details/id/:id", teachersController.getBankDetailsById); // NEW
router.get("/bank-details/:teacher_id", teachersController.getBankDetailsByTeacherId);
router.put("/bank-details/:id", teachersController.updateBankDetails);
router.delete("/bank-details/:id", teachersController.deleteBankDetails);


module.exports = router;  