const express = require('express');
const router = express.Router();
const planVariantController = require('../controllers/subscriptionPlanVariant.controller');

// Create a new plan variant
router.post('/', planVariantController.createPlanVariant);

// Get all plan variants
router.get('/', planVariantController.getAllPlanVariants);

// Get plan variants by institute type
router.get('/institute/:institute_type', planVariantController.getPlanVariantsByInstituteType);

// Get plan variants by plan master ID
router.get('/plan-master/:plan_master_id', planVariantController.getPlanVariantsByPlanMasterId);

// Get a single plan variant by ID
router.get('/:id', planVariantController.getPlanVariantById);

// Update a plan variant
router.put('/:id', planVariantController.updatePlanVariant);

// Delete a plan variant
router.delete('/:id', planVariantController.deletePlanVariant);

module.exports = router;