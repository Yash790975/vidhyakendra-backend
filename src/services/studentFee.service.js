const StudentFee   = require("../models/studentFee.model");
const FeeStructure = require("../models/feeStructure.model");
const FeeTerm      = require("../models/feeTerm.model");
const CustomError  = require("../exceptions/CustomError");
const statusCode   = require("../enums/statusCode");
const mongoose     = require("mongoose");

// ─── Shared frequency helper ──────────────────────────────────────────────────
// Also used by feeStructure.service.js and feeTerm.service.js
const shouldIncludeFeeHead = (frequency, termOrder) => {
  switch (frequency) {
    case "one_time":
    case "annual":
      return termOrder === 1;
    case "monthly":
      return true;
    case "quarterly":
      return termOrder % 3 === 1;   // terms 1, 4, 7, 10
    case "half_yearly":
      return termOrder % 6 === 1;   // terms 1, 7
    default:
      return true;
  }
};

// ─── CRUD ─────────────────────────────────────────────────────────────────────

const createStudentFee = async (data) => {
  const existing = await StudentFee.findOne({
    student_id: data.student_id,
    term_id:    data.term_id,
  });
  if (existing) {
    throw new CustomError(
      "A fee record already exists for this student and term",
      statusCode.CONFLICT
    );
  }

  const studentFee = new StudentFee(data);
  await studentFee.save();
  return studentFee;
};

/**
 * Generate a student fee for a specific term.
 * - Reads the fee_structure and applies frequency rules per term_order.
 * - Throws CONFLICT if a record already exists for (student, term).
 * - Coaching-compatible: accepts optional batch_id.
 */
const generateStudentFeeForTerm = async ({
  institute_id,
  student_id,
  class_id,
  section_id,
  batch_id,
  academic_year,
  term_id,
  fee_structure_id,
}) => {
  const existing = await StudentFee.findOne({ student_id, term_id });
  if (existing) {
    throw new CustomError(
      "Fee record already exists for this student and term",
      statusCode.CONFLICT
    );
  }

  const [feeStructure, term] = await Promise.all([
    FeeStructure.findById(fee_structure_id),
    FeeTerm.findById(term_id),
  ]);

  if (!feeStructure) throw new CustomError("Fee structure not found", statusCode.NOT_FOUND);
  if (!term)         throw new CustomError("Fee term not found",      statusCode.NOT_FOUND);

  const termOrder = term.term_order || 1;

  const applicableHeads = feeStructure.fee_heads.filter((head) =>
    shouldIncludeFeeHead(head.frequency, termOrder)
  );

  if (applicableHeads.length === 0) {
    throw new CustomError(
      "No applicable fee heads found for this term based on frequency rules",
      statusCode.BAD_REQUEST
    );
  }

  const fee_snapshot = applicableHeads.map((head) => ({
    name:      head.name,
    amount:    head.amount,
    frequency: head.frequency,
  }));

  const totalAmount = applicableHeads.reduce(
    (sum, head) => sum + parseFloat(head.amount.toString()),
    0
  );

  const studentFee = new StudentFee({
    institute_id,
    student_id,
    class_id,
    section_id:          section_id  || null,
    batch_id:            batch_id    || null,
    academic_year,
    term_id,
    fee_structure_id,
    fee_snapshot,
    total_amount:        mongoose.Types.Decimal128.fromString(totalAmount.toFixed(2)),
    paid_amount:         mongoose.Types.Decimal128.fromString("0"),
    due_amount:          mongoose.Types.Decimal128.fromString(totalAmount.toFixed(2)),
    due_date:            term.due_date,
    status:              "pending",
    is_late_fee_applied: false,
  });

  await studentFee.save();
  return studentFee;
};

const getAllStudentFees = async (filters = {}) => {
  const query = {};
  if (filters.institute_id)  query.institute_id  = filters.institute_id;
  if (filters.student_id)    query.student_id    = filters.student_id;
  if (filters.academic_year) query.academic_year = filters.academic_year;
  if (filters.class_id)      query.class_id      = filters.class_id;
  if (filters.batch_id)      query.batch_id      = filters.batch_id;
  if (filters.status)        query.status        = filters.status;

  return await StudentFee.find(query)
    .populate("student_id",       "full_name student_code")
    .populate("class_id",         "class_name")
    .populate("section_id",       "section_name")
    .populate("batch_id",         "batch_name batch_code")
    .populate("term_id",          "name term_order due_date")
    .populate("fee_structure_id", "academic_year")
    .sort({ created_at: -1 });
};

const getStudentFeeById = async (id) => {
  const studentFee = await StudentFee.findById(id)
    .populate("student_id",       "full_name student_code")
    .populate("class_id",         "class_name")
    .populate("section_id",       "section_name")
    .populate("batch_id",         "batch_name batch_code")
    .populate("term_id",          "name term_order due_date")
    .populate("fee_structure_id", "academic_year");

  if (!studentFee) {
    throw new CustomError("Student fee record not found", statusCode.NOT_FOUND);
  }
  return studentFee;
};

const getStudentFeesByStudentId = async (studentId, filters = {}) => {
  const query = { student_id: studentId };
  if (filters.academic_year) query.academic_year = filters.academic_year;
  if (filters.status)        query.status        = filters.status;

  return await StudentFee.find(query)
    .populate("batch_id",         "batch_name batch_code")
    .populate("term_id",          "name term_order due_date")
    .populate("fee_structure_id", "academic_year")
    .sort({ created_at: -1 });
};

const getStudentFeesByBatchId = async (batchId, filters = {}) => {
  const query = { batch_id: batchId };
  if (filters.academic_year) query.academic_year = filters.academic_year;
  if (filters.status)        query.status        = filters.status;

  return await StudentFee.find(query)
    .populate("student_id",       "full_name student_code")
    .populate("batch_id",         "batch_name batch_code")
    .populate("term_id",          "name term_order due_date")
    .populate("fee_structure_id", "academic_year")
    .sort({ created_at: -1 });
};

/**
 * Manual update of a student fee record.
 * Accepts: paid_amount, due_amount, status, is_late_fee_applied,
 *          late_fee_applied, fee_snapshot, total_amount.
 * Note: For bulk recalculations triggered by term/structure edits, the
 *       cascade helpers in feeStructure.service and feeTerm.service call
 *       studentFee.save() directly — they do NOT go through this function.
 */
const updateStudentFee = async (id, updateData) => {
  const studentFee = await StudentFee.findById(id);
  if (!studentFee) {
    throw new CustomError("Student fee record not found", statusCode.NOT_FOUND);
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) studentFee[key] = updateData[key];
  });

  await studentFee.save();
  return studentFee;
};

const applyLateFee = async (id, lateFeeAmount) => {
  const studentFee = await StudentFee.findById(id);
  if (!studentFee) {
    throw new CustomError("Student fee record not found", statusCode.NOT_FOUND);
  }
  if (studentFee.is_late_fee_applied) {
    throw new CustomError(
      "Late fee has already been applied to this record",
      statusCode.CONFLICT
    );
  }
  if (studentFee.status === "paid") {
    throw new CustomError(
      "Cannot apply late fee to a fully paid record",
      statusCode.BAD_REQUEST
    );
  }

  const currentDue = parseFloat(studentFee.due_amount.toString());
  const newDue     = currentDue + lateFeeAmount;

  studentFee.late_fee_applied   = mongoose.Types.Decimal128.fromString(lateFeeAmount.toFixed(2));
  studentFee.due_amount         = mongoose.Types.Decimal128.fromString(newDue.toFixed(2));
  studentFee.is_late_fee_applied = true;
  studentFee.status             = "overdue";

  await studentFee.save();
  return studentFee;
};

const deleteStudentFee = async (id) => {
  const studentFee = await StudentFee.findById(id);
  if (!studentFee) {
    throw new CustomError("Student fee record not found", statusCode.NOT_FOUND);
  }
  await StudentFee.findByIdAndDelete(id);
  return studentFee;
};

module.exports = {
  shouldIncludeFeeHead,          // exported so other services can import it
  createStudentFee,
  generateStudentFeeForTerm,
  getAllStudentFees,
  getStudentFeeById,
  getStudentFeesByStudentId,
  getStudentFeesByBatchId,
  updateStudentFee,
  applyLateFee,
  deleteStudentFee,
};

































































// const StudentFee = require("../models/studentFee.model");
// const FeeStructure = require("../models/feeStructure.model");
// const FeeTerm = require("../models/feeTerm.model");
// const CustomError = require("../exceptions/CustomError");
// const statusCode = require("../enums/statusCode");   
// const mongoose = require("mongoose");

// // ============= HELPERS =============

// /**
//  * Determines if a fee head should be included for a given term based on frequency.
//  * termOrder is 1-based.
//  */
// const shouldIncludeFeeHead = (frequency, termOrder) => {
//   switch (frequency) {
//     case "one_time":
//     case "annual":
//       return termOrder === 1;
//     case "monthly":
//       return true;
//     case "quarterly":
//       return termOrder % 3 === 1; // terms 1, 4, 7, 10
//     case "half_yearly":
//       return termOrder % 6 === 1; // terms 1, 7
//     default:
//       return true;
//   }
// };

// // ============= CRUD =============

// const createStudentFee = async (data) => {
//   const existing = await StudentFee.findOne({
//     student_id: data.student_id,
//     term_id: data.term_id,
//   });

//   if (existing) {
//     throw new CustomError(
//       "A fee record already exists for this student and term",
//       statusCode.CONFLICT
//     );
//   }

//   const studentFee = new StudentFee(data);
//   await studentFee.save();
//   return studentFee;
// };

// /**
//  * Generate student fee for a student for a specific term.
//  * Reads fee_structure, filters heads by frequency, creates student_fees doc.
//  * Coaching-compatible: passes through batch_id if provided.
//  */
// const generateStudentFeeForTerm = async ({
//   institute_id,
//   student_id,
//   class_id,
//   section_id,
//   batch_id,
//   academic_year,
//   term_id,
//   fee_structure_id,
// }) => {
//   const existing = await StudentFee.findOne({ student_id, term_id });
//   if (existing) {
//     throw new CustomError(
//       "Fee record already exists for this student and term",
//       statusCode.CONFLICT
//     );
//   }

//   const [feeStructure, term] = await Promise.all([
//     FeeStructure.findById(fee_structure_id),
//     FeeTerm.findById(term_id),
//   ]);

//   if (!feeStructure) {
//     throw new CustomError("Fee structure not found", statusCode.NOT_FOUND);
//   }
//   if (!term) {
//     throw new CustomError("Fee term not found", statusCode.NOT_FOUND);
//   }

//   const termOrder = term.term_order || 1;

//   const applicableHeads = feeStructure.fee_heads.filter((head) =>
//     shouldIncludeFeeHead(head.frequency, termOrder)
//   );

//   if (applicableHeads.length === 0) {
//     throw new CustomError(
//       "No applicable fee heads found for this term based on frequency rules",
//       statusCode.BAD_REQUEST
//     );
//   }

//   const fee_snapshot = applicableHeads.map((head) => ({
//     name:      head.name,
//     amount:    head.amount,
//     frequency: head.frequency,
//   }));

//   const totalAmount = applicableHeads.reduce(
//     (sum, head) => sum + parseFloat(head.amount.toString()),
//     0
//   );

//   const studentFee = new StudentFee({
//     institute_id,
//     student_id,
//     class_id,
//     section_id:  section_id || null,
//     batch_id:    batch_id || null,          // Coaching-compatible
//     academic_year,
//     term_id,
//     fee_structure_id,
//     fee_snapshot,
//     total_amount: mongoose.Types.Decimal128.fromString(totalAmount.toFixed(2)),
//     paid_amount:  mongoose.Types.Decimal128.fromString("0"),
//     due_amount:   mongoose.Types.Decimal128.fromString(totalAmount.toFixed(2)),
//     due_date:     term.due_date,
//     status:       "pending",
//     is_late_fee_applied: false,
//   });

//   await studentFee.save();
//   return studentFee;
// };

// const getAllStudentFees = async (filters = {}) => {
//   const query = {};
//   if (filters.institute_id)  query.institute_id  = filters.institute_id;
//   if (filters.student_id)    query.student_id    = filters.student_id;
//   if (filters.academic_year) query.academic_year = filters.academic_year;
//   if (filters.class_id)      query.class_id      = filters.class_id;
//   if (filters.batch_id)      query.batch_id      = filters.batch_id;  // Coaching-compatible
//   if (filters.status)        query.status        = filters.status;

//   return await StudentFee.find(query)
//     .populate("student_id",       "full_name student_code")
//     .populate("class_id",         "class_name")
//     .populate("section_id",       "section_name")
//     .populate("batch_id",         "batch_name batch_code")   // Coaching-compatible
//     .populate("term_id",          "name term_order due_date")
//     .populate("fee_structure_id", "academic_year")
//     .sort({ created_at: -1 });
// };

// const getStudentFeeById = async (id) => {
//   const studentFee = await StudentFee.findById(id)
//     .populate("student_id",       "full_name student_code")
//     .populate("class_id",         "class_name")
//     .populate("section_id",       "section_name")
//     .populate("batch_id",         "batch_name batch_code")   // Coaching-compatible
//     .populate("term_id",          "name term_order due_date")
//     .populate("fee_structure_id", "academic_year");

//   if (!studentFee) {
//     throw new CustomError("Student fee record not found", statusCode.NOT_FOUND);
//   }

//   return studentFee;
// };

// const getStudentFeesByStudentId = async (studentId, filters = {}) => {
//   const query = { student_id: studentId };
//   if (filters.academic_year) query.academic_year = filters.academic_year;
//   if (filters.status)        query.status        = filters.status;

//   return await StudentFee.find(query)
//     .populate("batch_id",         "batch_name batch_code")   // Coaching-compatible
//     .populate("term_id",          "name term_order due_date")
//     .populate("fee_structure_id", "academic_year")
//     .sort({ created_at: -1 });
// };

// // Coaching-compatible: get all student fees for a batch
// const getStudentFeesByBatchId = async (batchId, filters = {}) => {
//   const query = { batch_id: batchId };
//   if (filters.academic_year) query.academic_year = filters.academic_year;
//   if (filters.status)        query.status        = filters.status;

//   return await StudentFee.find(query)
//     .populate("student_id",       "full_name student_code")
//     .populate("batch_id",         "batch_name batch_code")
//     .populate("term_id",          "name term_order due_date")
//     .populate("fee_structure_id", "academic_year")
//     .sort({ created_at: -1 });
// };

// const updateStudentFee = async (id, updateData) => {
//   const studentFee = await StudentFee.findById(id);

//   if (!studentFee) {
//     throw new CustomError("Student fee record not found", statusCode.NOT_FOUND);
//   }

//   Object.keys(updateData).forEach((key) => {
//     if (updateData[key] !== undefined) {
//       studentFee[key] = updateData[key];
//     }
//   });

//   await studentFee.save();
//   return studentFee;
// };

// const applyLateFee = async (id, lateFeeAmount) => {
//   const studentFee = await StudentFee.findById(id);

//   if (!studentFee) {
//     throw new CustomError("Student fee record not found", statusCode.NOT_FOUND);
//   }

//   if (studentFee.is_late_fee_applied) {
//     throw new CustomError(
//       "Late fee has already been applied to this record",
//       statusCode.CONFLICT
//     );
//   }

//   if (studentFee.status === "paid") {
//     throw new CustomError(
//       "Cannot apply late fee to a fully paid record",
//       statusCode.BAD_REQUEST
//     );
//   }

//   const currentDue = parseFloat(studentFee.due_amount.toString());
//   const newDue = currentDue + lateFeeAmount;

//   studentFee.late_fee_applied = mongoose.Types.Decimal128.fromString(lateFeeAmount.toFixed(2));
//   studentFee.due_amount       = mongoose.Types.Decimal128.fromString(newDue.toFixed(2));
//   studentFee.is_late_fee_applied = true;
//   studentFee.status           = "overdue";

//   await studentFee.save();
//   return studentFee;
// };

// const deleteStudentFee = async (id) => {
//   const studentFee = await StudentFee.findById(id);

//   if (!studentFee) {
//     throw new CustomError("Student fee record not found", statusCode.NOT_FOUND);
//   }

//   await StudentFee.findByIdAndDelete(id);
//   return studentFee;
// };

// module.exports = {
//   createStudentFee,
//   generateStudentFeeForTerm,
//   getAllStudentFees,
//   getStudentFeeById,
//   getStudentFeesByStudentId,
//   getStudentFeesByBatchId,
//   updateStudentFee,
//   applyLateFee,
//   deleteStudentFee,
// };

