// routes/teacherSalaryStructure.routes.js
const express = require('express');
const router = express.Router();
const teacherSalaryStructureController = require('../controllers/teacherSalaryStructure.controller');
const { verifyInstituteAdminToken } = require('../middlewares/instituteAdminAuth');

// ==================== PROTECTED ROUTES ====================

// Create salary structure
router.post(
  '/salary-structure',
  // verifyInstituteAdminToken,
  teacherSalaryStructureController.createSalaryStructure
);

// Update salary structure
router.put(
  '/salary-structure/:id',
  // verifyInstituteAdminToken,
  teacherSalaryStructureController.updateSalaryStructure
);

// Approve salary structure (NEW but endpoint style preserved)
router.put(
  '/salary-structure/:id/approve',
  verifyInstituteAdminToken,
  teacherSalaryStructureController.approveSalaryStructure
);

// Archive salary structure
router.put(
  '/salary-structure/:id/archive',
  verifyInstituteAdminToken,
  teacherSalaryStructureController.archiveSalaryStructure
);

// Delete salary structure
router.delete(
  '/salary-structure/:id',
  // verifyInstituteAdminToken,
  teacherSalaryStructureController.deleteSalaryStructure
);

// ==================== PUBLIC ROUTES ====================

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

