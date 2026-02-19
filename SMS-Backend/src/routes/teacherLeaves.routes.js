const express = require('express');
const router = express.Router();
const teacherLeavesController = require('../controllers/teacherLeaves.controller');

// All routes - no authentication required
router.post('/leave', teacherLeavesController.createLeave); 
router.get('/leave', teacherLeavesController.getAllLeaves); 
router.get('/leave/:id', teacherLeavesController.getLeaveById);
router.get('/leave/teacher/:teacher_id', teacherLeavesController.getLeavesByTeacherId);
router.get('/leave/status/:status', teacherLeavesController.getLeavesByStatus);
router.put('/leave/:id', teacherLeavesController.updateLeave);
router.delete('/leave/:id', teacherLeavesController.deleteLeave);
 
// Approve/Reject routes - now accept approved_by in body
router.put('/leave/:id/approve', teacherLeavesController.approveLeave);
router.put('/leave/:id/reject', teacherLeavesController.rejectLeave);

module.exports = router;











































































// // routes/teacherLeaves.routes.js
// const express = require('express');
// const router = express.Router();
// const teacherLeavesController = require('../controllers/teacherLeaves.controller');
// const { verifyInstituteAdminToken } = require('../middlewares/instituteAdminAuth');

// // Public routes - no authentication required
// router.post('/leave', teacherLeavesController.createLeave); 
// router.get('/leave', teacherLeavesController.getAllLeaves);
// router.get('/leave/:id', teacherLeavesController.getLeaveById);
// router.get('/leave/teacher/:teacher_id', teacherLeavesController.getLeavesByTeacherId);
// router.get('/leave/status/:status', teacherLeavesController.getLeavesByStatus);
// router.put('/leave/:id', teacherLeavesController.updateLeave);
// router.delete('/leave/:id', teacherLeavesController.deleteLeave);
 
// // Protected routes - require institute admin authentication
// router.put(
//   '/leave/:id/approve', 
//   verifyInstituteAdminToken, 
//   teacherLeavesController.approveLeave
// );
 
// router.put(
//   '/leave/:id/reject', 
//   verifyInstituteAdminToken, 
//   teacherLeavesController.rejectLeave
// );

// module.exports = router;





































// const express = require('express');
// const router = express.Router();
// const teacherLeavesController = require('../controllers/teacherLeaves.controller');
   
// router.post('/leave', teacherLeavesController.createLeave); 
// router.get('/leave', teacherLeavesController.getAllLeaves);
// router.get('/leave/:id', teacherLeavesController.getLeaveById);
// router.get('/leave/teacher/:teacher_id', teacherLeavesController.getLeavesByTeacherId);
// router.get('/leave/status/:status', teacherLeavesController.getLeavesByStatus);
// router.put('/leave/:id', teacherLeavesController.updateLeave);
// router.put('/leave/:id/approve', teacherLeavesController.approveLeave);
// router.put('/leave/:id/reject', teacherLeavesController.rejectLeave);
// router.delete('/leave/:id', teacherLeavesController.deleteLeave);

// module.exports = router;