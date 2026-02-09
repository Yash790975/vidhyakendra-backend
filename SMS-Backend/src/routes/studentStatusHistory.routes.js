const express = require('express');
const router = express.Router();
const studentStatusHistoryController = require('../controllers/studentStatusHistory.controller');

// Create status history
router.post('/status-history', studentStatusHistoryController.createStatusHistory);

// Get all status histories
router.get('/status-history', studentStatusHistoryController.getAllStatusHistories);

// Get status history by ID
router.get('/status-history/:id', studentStatusHistoryController.getStatusHistoryById);

// Get status histories by student ID
router.get(
  '/status-history/student/:student_id',
  studentStatusHistoryController.getStatusHistoriesByStudentId
);

// Get status histories by status
router.get(
  '/status-history/status/:status',
  studentStatusHistoryController.getStatusHistoriesByStatus
);

// Get status histories by admin ID
router.get(
  '/status-history/admin/:admin_id',
  studentStatusHistoryController.getStatusHistoriesByAdminId
);

// Update status history
router.put('/status-history/:id', studentStatusHistoryController.updateStatusHistory);

// Delete status history
router.delete('/status-history/:id', studentStatusHistoryController.deleteStatusHistory);

module.exports = router;