const express = require('express');
const router = express.Router();
const subjectsMasterController = require('../controllers/subjectsMaster.controller');


router.post('/subject', subjectsMasterController.createSubject);
router.get('/subject', subjectsMasterController.getAllSubjects);
router.get('/subject/:id', subjectsMasterController.getSubjectById);
router.get('/subject/institute/:institute_id', subjectsMasterController.getSubjectsByInstituteId);
router.get('/subject/type/:type', subjectsMasterController.getSubjectsByType);
router.get('/subject/status/:status', subjectsMasterController.getSubjectsByStatus);
router.get('/subject/class-level/:class_level', subjectsMasterController.getSubjectsByClassLevel);
router.get('/subject/institute/:institute_id/type/:type', subjectsMasterController.getSubjectsByInstituteAndType);
router.put('/subject/:id', subjectsMasterController.updateSubject);
router.delete('/subject/:id', subjectsMasterController.deleteSubject);

module.exports = router;


























































// const express = require('express');
// const router = express.Router();
// const subjectsMasterController = require('../controllers/subjectsMaster.controller');

// router.post('/subject', subjectsMasterController.createSubject);
// router.get('/subject', subjectsMasterController.getAllSubjects);
// router.get('/subject/:id', subjectsMasterController.getSubjectById);
// router.get('/subject/institute/:institute_id', subjectsMasterController.getSubjectsByInstituteId);
// router.get('/subject/type/:type', subjectsMasterController.getSubjectsByType);
// router.get('/subject/status/:status', subjectsMasterController.getSubjectsByStatus);
// router.put('/subject/:id', subjectsMasterController.updateSubject);
// router.delete('/subject/:id', subjectsMasterController.deleteSubject);

// module.exports = router; 


