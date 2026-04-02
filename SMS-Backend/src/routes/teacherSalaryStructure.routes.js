// routes/teacherSalaryStructure.routes.js
const express = require('express');
const router = express.Router();
const teacherSalaryStructureController = require('../controllers/teacherSalaryStructure.controller');

// All routes - no authentication required

// Create salary structure
router.post(
  '/salary-structure',
  teacherSalaryStructureController.createSalaryStructure
);

// Update salary structure
router.put(   
  '/salary-structure/:id',
  teacherSalaryStructureController.updateSalaryStructure
);

// Approve salary structure
router.put(
  '/salary-structure/:id/approve',
  teacherSalaryStructureController.approveSalaryStructure
);

// Archive salary structure
router.put(
  '/salary-structure/:id/archive',
  teacherSalaryStructureController.archiveSalaryStructure
);

// Delete salary structure
router.delete(
  '/salary-structure/:id',
  teacherSalaryStructureController.deleteSalaryStructure
);

// Get all salary structures
router.get(
  '/salary-structure',
  teacherSalaryStructureController.getAllSalaryStructures
);

// Get salary structure by ID
router.get(
  '/salary-structure/:id',
  teacherSalaryStructureController.getSalaryStructureById
);

// Get salary structures by teacher ID
router.get(
  '/salary-structure/teacher/:teacher_id',
  teacherSalaryStructureController.getSalaryStructuresByTeacherId
);

// Get active salary structure by teacher ID
router.get(
  '/salary-structure/teacher/:teacher_id/active',
  teacherSalaryStructureController.getActiveSalaryStructureByTeacherId
);

module.exports = router;

