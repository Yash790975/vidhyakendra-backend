const express = require('express');
const router = express.Router();
const controller = require('../controllers/subscriptionTransactions.controller');

router.post('/', controller.createSubscriptionTransaction); 
router.get('/', controller.getAllSubscriptionTransactions);
router.get('/:id', controller.getSubscriptionTransactionById);
router.get('/institute/:institute_id', controller.getSubscriptionTransactionsByInstituteId);
router.get('/active/list', controller.getActiveSubscriptions);
router.get('/expired/list', controller.getExpiredSubscriptions);
router.get('/expiring/:days', controller.getExpiringSubscriptions);
router.put('/:id', controller.updateSubscriptionTransaction);
router.patch('/:id/deactivate', controller.deactivateSubscription);
router.delete('/:id', controller.deleteSubscriptionTransaction);

module.exports = router;    
 