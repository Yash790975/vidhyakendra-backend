const express = require('express');
const router = express.Router();
const subjectsByClassController = require('../controllers/subjectsByClass.controller');

// Create — POST /subject-by-class
router.post('/subject-by-class', subjectsByClassController.createSubjectByClass);

// Read — all
router.get('/subject-by-class', subjectsByClassController.getAllSubjectsByClass);
    
// Read — by record ID
router.get('/subject-by-class/:id', subjectsByClassController.getSubjectByClassId);

// Read — by institute
router.get('/subject-by-class/institute/:institute_id', subjectsByClassController.getSubjectsByClassInstituteId);

// Read — by class
router.get('/subject-by-class/class/:class_id', subjectsByClassController.getSubjectsByClassId);

// Read — by institute + class
router.get(
  '/subject-by-class/institute/:institute_id/class/:class_id',
  subjectsByClassController.getSubjectsByInstituteAndClass
);

// Read — by institute + class + section
router.get(
  '/subject-by-class/institute/:institute_id/class/:class_id/section/:section_id',
  subjectsByClassController.getSubjectsByInstituteClassAndSection
);

// Read — by status
router.get('/subject-by-class/status/:status', subjectsByClassController.getSubjectsByClassStatus);

// Read — by subject_type (theory / practical / both)
router.get('/subject-by-class/type/:type', subjectsByClassController.getSubjectsByClassType);

// Update
router.put('/subject-by-class/:id', subjectsByClassController.updateSubjectByClass);

// Delete
router.delete('/subject-by-class/:id', subjectsByClassController.deleteSubjectByClass);

module.exports = router;
