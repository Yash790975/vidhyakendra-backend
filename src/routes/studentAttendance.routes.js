const express = require('express');
const router = express.Router();
const studentAttendanceController = require('../controllers/studentAttendance.controller');

// Create attendance
router.post('/attendance', studentAttendanceController.createAttendance);

// Bulk create attendance
router.post('/attendance/bulk', studentAttendanceController.bulkCreateAttendance);

// Get all attendance
router.get('/attendance', studentAttendanceController.getAllAttendance);

// Get attendance by ID
router.get('/attendance/:id', studentAttendanceController.getAttendanceById);

// Get attendance by student ID
router.get('/attendance/student/:student_id', studentAttendanceController.getAttendanceByStudentId);

// Get attendance by class ID
router.get('/attendance/class/:class_id', studentAttendanceController.getAttendanceByClassId);

// Get attendance by date
router.get('/attendance/date/:date', studentAttendanceController.getAttendanceByDate);

// Get attendance by date range (query params: start_date, end_date)
router.get('/attendance/date-range/filter', studentAttendanceController.getAttendanceByDateRange);

// Get attendance by teacher ID
router.get('/attendance/teacher/:teacher_id', studentAttendanceController.getAttendanceByTeacherId);

// Get attendance by status
router.get('/attendance/status/:status', studentAttendanceController.getAttendanceByStatus);

// Get attendance statistics by student (optional query params: start_date, end_date)
router.get('/attendance/student/:student_id/stats', studentAttendanceController.getAttendanceStatsByStudent);

// Update attendance
router.put('/attendance/:id', studentAttendanceController.updateAttendance);

// Delete attendance
router.delete('/attendance/:id', studentAttendanceController.deleteAttendance);

module.exports = router;