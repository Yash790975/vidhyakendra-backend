const FeeReceipt = require("../models/feeReceipt.model");
const StudentFee = require("../models/studentFee.model");
const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode"); 
const mongoose = require("mongoose");

// ============= RECEIPT NUMBER GENERATOR ============= 

/**
 * Generate a unique receipt number.
 * Format: RCP-<YEAR>-<SEQUENCE> e.g. RCP-2025-00001
 */
const generateReceiptNumber = async () => {
  const year = new Date().getFullYear();
  const prefix = `RCP-${year}-`;

  const lastReceipt = await FeeReceipt.findOne({
    receipt_number: { $regex: `^${prefix}` },
  }).sort({ receipt_number: -1 });

  let sequence = 1;
  if (lastReceipt) {
    const lastSeq = parseInt(lastReceipt.receipt_number.split("-")[2], 10);
    sequence = lastSeq + 1;
  }

  return `${prefix}${String(sequence).padStart(5, "0")}`;
};

// ============= SERVICE METHODS =============

const createFeeReceipt = async (data) => {
  // Fetch the student fee record
  const studentFee = await StudentFee.findById(data.student_fee_id);

  if (!studentFee) {
    throw new CustomError("Student fee record not found", statusCode.NOT_FOUND);
  }

  if (studentFee.status === "paid") {
    throw new CustomError(
      "This fee has already been fully paid",
      statusCode.BAD_REQUEST
    );
  }

  const amountPaid = parseFloat(data.amount_paid);
  const currentDue = parseFloat(studentFee.due_amount.toString());
  const currentPaid = parseFloat(studentFee.paid_amount.toString());

  if (amountPaid > currentDue) {
    throw new CustomError(
      `Amount paid (${amountPaid}) cannot exceed due amount (${currentDue})`,
      statusCode.BAD_REQUEST
    );
  }

  // Generate receipt number
  const receipt_number = await generateReceiptNumber();

  const receipt = new FeeReceipt({
    ...data,
    receipt_number,
  });

  await receipt.save();

  // Update student fee record
  const newPaid = currentPaid + amountPaid;
  const newDue = currentDue - amountPaid;

  studentFee.paid_amount = mongoose.Types.Decimal128.fromString(
    newPaid.toFixed(2)
  );
  studentFee.due_amount = mongoose.Types.Decimal128.fromString(
    newDue.toFixed(2)
  );

  if (newDue <= 0) {
    studentFee.status = "paid";
  } else if (newPaid > 0) {
    studentFee.status = "partial";
  }

  await studentFee.save();

  return receipt;
};

const getAllFeeReceipts = async (filters = {}) => {
  const query = {};
  if (filters.institute_id) query.institute_id = filters.institute_id;
  if (filters.student_id) query.student_id = filters.student_id;

  return await FeeReceipt.find(query)
    .populate("student_id", "full_name student_code")
    .populate("student_fee_id", "academic_year total_amount status")
    .populate("term_id", "name term_order")
    .populate("collected_by", "full_name")
    .sort({ created_at: -1 });
};

const getFeeReceiptById = async (id) => {
  const receipt = await FeeReceipt.findById(id)
    .populate("student_id", "full_name student_code")
    .populate("student_fee_id", "academic_year total_amount status fee_snapshot")
    .populate("term_id", "name term_order due_date")
    .populate("collected_by", "full_name");

  if (!receipt) {
    throw new CustomError("Fee receipt not found", statusCode.NOT_FOUND);
  }

  return receipt;
};

const getFeeReceiptsByStudentId = async (studentId) => {
  return await FeeReceipt.find({ student_id: studentId })
    .populate("student_fee_id", "academic_year total_amount status")
    .populate("term_id", "name term_order")
    .populate("collected_by", "full_name")
    .sort({ payment_date: -1 });
};

const getFeeReceiptsByStudentFeeId = async (studentFeeId) => {
  return await FeeReceipt.find({ student_fee_id: studentFeeId })
    .populate("collected_by", "full_name")
    .sort({ payment_date: -1 });
};

const deleteFeeReceipt = async (id) => {
  const receipt = await FeeReceipt.findById(id);

  if (!receipt) {
    throw new CustomError("Fee receipt not found", statusCode.NOT_FOUND);
  }

  // Reverse the payment on student_fees
  const studentFee = await StudentFee.findById(receipt.student_fee_id);
  if (studentFee) {
    const amountPaid = parseFloat(receipt.amount_paid.toString());
    const currentPaid = parseFloat(studentFee.paid_amount.toString());
    const currentDue = parseFloat(studentFee.due_amount.toString());

    const newPaid = Math.max(0, currentPaid - amountPaid);
    const newDue = currentDue + amountPaid;

    studentFee.paid_amount = mongoose.Types.Decimal128.fromString(
      newPaid.toFixed(2)
    );
    studentFee.due_amount = mongoose.Types.Decimal128.fromString(
      newDue.toFixed(2)
    );

    if (newPaid === 0) {
      studentFee.status = studentFee.is_late_fee_applied ? "overdue" : "pending";
    } else {
      studentFee.status = "partial";
    }

    await studentFee.save();
  }

  await FeeReceipt.findByIdAndDelete(id);
  return receipt;
};

module.exports = {
  createFeeReceipt,
  getAllFeeReceipts,
  getFeeReceiptById,
  getFeeReceiptsByStudentId,
  getFeeReceiptsByStudentFeeId,
  deleteFeeReceipt,
};
