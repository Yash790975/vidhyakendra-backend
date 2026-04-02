const express = require('express');
const router = express.Router();
const coachingTeacherDetailController = require('../controllers/coachingTeacherDetail.controller');

// CRUD operations
router.post('/create', coachingTeacherDetailController.createDetail);
router.get('/get-all', coachingTeacherDetailController.getAllDetails);
router.get('/get/:id', coachingTeacherDetailController.getDetailById);
router.put('/update/:id', coachingTeacherDetailController.updateDetail);
router.delete('/delete/:id', coachingTeacherDetailController.deleteDetail);

// Additional endpoints
router.get('/get-by-teacher/:teacherId', coachingTeacherDetailController.getDetailByTeacherId);
router.get('/get-by-role/:role', coachingTeacherDetailController.getDetailsByRole);
router.get('/get-by-subject/:subject', coachingTeacherDetailController.getDetailsBySubject);
router.get('/get-by-batch/:batchId', coachingTeacherDetailController.getDetailsByBatchId);
router.get('/get-by-payout/:payoutModel', coachingTeacherDetailController.getDetailsByPayoutModel);
router.delete('/delete-by-teacher/:teacherId', coachingTeacherDetailController.deleteDetailByTeacherId);

// Batch management
router.post('/add-batch/:id', coachingTeacherDetailController.addBatch);
router.post('/remove-batch/:id', coachingTeacherDetailController.removeBatch); 

module.exports = router;