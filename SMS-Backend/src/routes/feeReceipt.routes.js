const express = require("express");
const router = express.Router();
const feeReceiptController = require("../controllers/feeReceipt.controller");

// ============= FEE RECEIPTS =============

// Get all fee receipts (supports query filters: institute_id, student_id)
router.get("/fee-receipt", feeReceiptController.getAllFeeReceipts);

// Get fee receipts by student ID
router.get(
  "/fee-receipt/student/:student_id",
  feeReceiptController.getFeeReceiptsByStudentId
);

// Get fee receipts by student fee ID
router.get(
  "/fee-receipt/student-fee/:student_fee_id",
  feeReceiptController.getFeeReceiptsByStudentFeeId
);

// Get fee receipt by ID
router.get("/fee-receipt/:id", feeReceiptController.getFeeReceiptById);

// Create fee receipt (records a payment and auto-updates student_fee)
router.post("/fee-receipt", feeReceiptController.createFeeReceipt);

// Delete fee receipt (auto-reverses payment on student_fee)
router.delete("/fee-receipt/:id", feeReceiptController.deleteFeeReceipt);

module.exports = router;
