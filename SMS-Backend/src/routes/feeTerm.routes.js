const express = require("express");
const router = express.Router();
const feeTermController = require("../controllers/feeTerm.controller");

// ============= FEE TERMS =============

// Get all fee terms (supports query filters: institute_id, academic_year, status)
router.get("/fee-term", feeTermController.getAllFeeTerms);

// Get fee terms by institute ID and academic year
router.get(
  "/fee-term/institute/:institute_id/year/:academic_year",
  feeTermController.getFeeTermsByInstituteAndYear
);

// Get fee term by ID
router.get("/fee-term/:id", feeTermController.getFeeTermById);

// Create single fee term
router.post("/fee-term", feeTermController.createFeeTerm);

// Create bulk fee terms (array of term objects)
router.post("/fee-term/bulk", feeTermController.createBulkFeeTerms);

// Update fee term
router.put("/fee-term/:id", feeTermController.updateFeeTerm);

// Delete fee term
router.delete("/fee-term/:id", feeTermController.deleteFeeTerm);

module.exports = router;
