const express = require("express");
const router = express.Router();
const feeStructureController = require("../controllers/feeStructure.controller");

// ============= FEE STRUCTURES =============

// Get all fee structures
// Query filters: institute_id, class_id, batch_id, academic_year, status
router.get("/fee-structure", feeStructureController.getAllFeeStructures);

// Get fee structures by class ID
// Query filters: academic_year, status
router.get(
  "/fee-structure/class/:class_id",
  feeStructureController.getFeeStructuresByClass
);

// Get fee structures by batch ID (coaching-compatible)
// Query filters: academic_year, status
router.get(
  "/fee-structure/batch/:batch_id",
  feeStructureController.getFeeStructuresByBatch
);

// Get fee structure by ID
router.get("/fee-structure/:id", feeStructureController.getFeeStructureById);

// Create fee structure
router.post("/fee-structure", feeStructureController.createFeeStructure);

// Update fee structure
router.put("/fee-structure/:id", feeStructureController.updateFeeStructure);

// Delete fee structure
router.delete("/fee-structure/:id", feeStructureController.deleteFeeStructure);

module.exports = router;










































































// const express = require("express");
// const router = express.Router();
// const feeStructureController = require("../controllers/feeStructure.controller");

// // ============= FEE STRUCTURES ============= 

// // Get all fee structures (supports query filters: institute_id, class_id, academic_year, status)
// router.get("/fee-structure", feeStructureController.getAllFeeStructures);

// // Get fee structures by class ID (supports query filters: academic_year, status)
// router.get(
//   "/fee-structure/class/:class_id", 
//   feeStructureController.getFeeStructuresByClass 
// );    

// // Get fee structure by ID
// router.get("/fee-structure/:id", feeStructureController.getFeeStructureById);

// // Create fee structure
// router.post("/fee-structure", feeStructureController.createFeeStructure);

// // Update fee structure
// router.put("/fee-structure/:id", feeStructureController.updateFeeStructure);

// // Delete fee structure
// router.delete("/fee-structure/:id", feeStructureController.deleteFeeStructure);

// module.exports = router;
