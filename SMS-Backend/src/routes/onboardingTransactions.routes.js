const express = require('express');
const router = express.Router();
const controller = require('../controllers/onboardingTransaction.controller');

router.post('/', controller.createTransaction);

router.get('/', controller.getAllTransactions);
router.get('/:id', controller.getTransactionById);     

// routes/onboardingTransaction.routes.js
router.get('/transactions/full-details', controller.getTransactionsWithFullDetails); 
router.get('/transaction/full-details/onboarding/:onboarding_basic_info_id',controller.getTransactionWithFullDetailsByOnboardingBasicInfoId);
 


router.get('/reference/:reference_id', controller.getTransactionByReferenceId);  
router.get('/onboarding/:onboarding_id', controller.getTransactionsByOnboardingId);

router.get('/payment-status/:payment_status', controller.getTransactionsByPaymentStatus);
router.get('/application-status/:application_status', controller.getTransactionsByApplicationStatus);

router.put('/update-transaction/:id', controller.updateTransaction); 
router.patch('/:id/payment-status', controller.updatePaymentStatus);
router.patch('/:id/application-status', controller.updateApplicationStatus); 

router.delete('/:id', controller.deleteTransaction); 

module.exports = router; 