const express = require('express');
const router = express.Router();
const onboardingController = require('../controllers/onboardingBasicInformation.controller');

// Create a new onboarding record
router.post('/', onboardingController.createOnboarding);

// Get all onboarding records
router.get('/', onboardingController.getAllOnboardings);

// Get verified onboarding records
router.get('/verified', onboardingController.getVerifiedOnboardings);

// Get unverified onboarding records
router.get('/unverified', onboardingController.getUnverifiedOnboardings);

// Send OTP
router.post('/send-otp', onboardingController.sendOTP);

// Resend OTP
router.post('/resend-otp', onboardingController.resendOTP);

// Verify OTP
router.post('/verify-otp', onboardingController.verifyOTP);

// Get a single onboarding record by ID
router.get('/:id', onboardingController.getOnboardingById);

// Update an onboarding record
router.put('/:id', onboardingController.updateOnboarding);

// Delete an onboarding record
router.delete('/:id', onboardingController.deleteOnboarding);

module.exports = router;