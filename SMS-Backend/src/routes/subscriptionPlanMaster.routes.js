const express = require('express');
const router = express.Router();
const planMasterController = require('../controllers/subscriptionPlanMaster.controller');

// Create a new plan master
router.post('/', planMasterController.createPlanMaster);

// Get all plan masters
router.get('/', planMasterController.getAllPlanMasters);

// Get active plan masters
router.get('/active', planMasterController.getActivePlanMasters);

// Get a single plan master by ID
router.get('/:id', planMasterController.getPlanMasterById);

// Update a plan master
router.put('/:id', planMasterController.updatePlanMaster);

// Delete a plan master
router.delete('/:id', planMasterController.deletePlanMaster);

module.exports = router;