const express = require('express');
const router = express.Router();
const controller = require('../controllers/instituteDetailsMaster.controller');
 
router.post('/', controller.createInstituteDetails);
router.get('/', controller.getAllInstituteDetails);
router.get('/:id', controller.getInstituteDetailsById);
router.get('/institute/:institute_id', controller.getInstituteDetailsByInstituteId);
router.get('/school-board/:school_board', controller.getInstituteDetailsBySchoolBoard);
router.get('/school-type/:school_type', controller.getInstituteDetailsBySchoolType);
router.get('/medium/:medium', controller.getInstituteDetailsByMedium);
router.get('/students-range/:approx_students_range', controller.getInstituteDetailsByStudentsRange);
router.put('/:id', controller.updateInstituteDetails);
router.delete('/:id', controller.deleteInstituteDetails);

module.exports = router;      