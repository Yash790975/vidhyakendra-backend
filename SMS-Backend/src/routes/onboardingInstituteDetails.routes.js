const express = require('express');
const router = express.Router();
const instituteDetailsController = require('../controllers/onboardingInstituteDetails.controller');

// Create institute details
router.post('/', instituteDetailsController.createInstituteDetails);

// Get all institute details
router.get('/', instituteDetailsController.getAllInstituteDetails);

// Get institute details by school board
router.get('/school-board/:school_board', instituteDetailsController.getInstituteDetailsBySchoolBoard);

// Get institute details by school type
router.get('/school-type/:school_type', instituteDetailsController.getInstituteDetailsBySchoolType);

// Get institute details by medium
router.get('/medium/:medium', instituteDetailsController.getInstituteDetailsByMedium);

// Get institute details by students range
router.get('/students-range/:students_range', instituteDetailsController.getInstituteDetailsByStudentsRange);

// Get institute details by basic info ID
router.get('/basic-info/:onboarding_basic_info_id', instituteDetailsController.getInstituteDetailsByBasicInfoId);

// Get complete onboarding data (basic info + institute details)
router.get('/complete/:onboarding_basic_info_id', instituteDetailsController.getCompleteOnboardingData);

// Get institute details by ID
router.get('/:id', instituteDetailsController.getInstituteDetailsById);

// Update institute details
router.put('/:id', instituteDetailsController.updateInstituteDetails);

// Delete institute details
router.delete('/:id', instituteDetailsController.deleteInstituteDetails);

module.exports = router;