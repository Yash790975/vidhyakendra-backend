const express = require('express');
const router = express.Router();
const teacherAttendanceController = require('../controllers/teacherAttendance.controller');

router.post('/attendance', teacherAttendanceController.createAttendance);
router.get('/attendance', teacherAttendanceController.getAllAttendance);
router.get('/attendance/:id', teacherAttendanceController.getAttendanceById);
router.get('/attendance/teacher/:teacher_id', teacherAttendanceController.getAttendanceByTeacherId);
router.get('/attendance/date/:date', teacherAttendanceController.getAttendanceByDate);
router.get('/attendance/date-range', teacherAttendanceController.getAttendanceByDateRange);
router.put('/attendance/:id', teacherAttendanceController.updateAttendance);
router.delete('/attendance/:id', teacherAttendanceController.deleteAttendance);

module.exports = router;



























// const express = require('express');
// const router = express.Router();
// const teacherAttendanceController = require('../controllers/teacherAttendance.controller');

// router.post('/create', teacherAttendanceController.createAttendance);
// router.get('/get-all', teacherAttendanceController.getAllAttendance);
// router.get('/get/:id', teacherAttendanceController.getAttendanceById);
// router.get('/get-by-teacher/:teacherId', teacherAttendanceController.getAttendanceByTeacherId);
// router.get('/get-by-date/:date', teacherAttendanceController.getAttendanceByDate);
// router.get('/get-by-date-range', teacherAttendanceController.getAttendanceByDateRange);
// router.put('/update/:id', teacherAttendanceController.updateAttendance);
// router.delete('/delete/:id', teacherAttendanceController.deleteAttendance);

// module.exports = router;  