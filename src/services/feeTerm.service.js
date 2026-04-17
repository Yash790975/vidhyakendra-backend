const FeeTerm    = require("../models/feeTerm.model");
const StudentFee = require("../models/studentFee.model");
const FeeStructure = require("../models/feeStructure.model");
const CustomError  = require("../exceptions/CustomError");
const statusCode   = require("../enums/statusCode");
const mongoose     = require("mongoose");

// ─── Shared frequency helper (mirrors studentFee.service.js) ─────────────────
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

/**
 * Recompute a student-fee record using the (possibly updated) fee-structure
 * and term_order, then save it.
 *
 * @param {Object} studentFee  - Mongoose document (StudentFee)
 * @param {Object} feeStructure - Mongoose document (FeeStructure)
 * @param {number} termOrder    - 1-based order of the term
 */
const recalculateStudentFee = async (studentFee, feeStructure, termOrder) => {
  const applicableHeads = feeStructure.fee_heads.filter((h) =>
    shouldIncludeFeeHead(h.frequency, termOrder)
  );

  if (applicableHeads.length === 0) return; // nothing to do

  const newSnapshot = applicableHeads.map((h) => ({
    name:      h.name,
    amount:    h.amount,           // Decimal128 — stored as-is, serialises fine
    frequency: h.frequency,
  }));

  const newTotal = applicableHeads.reduce(
    (sum, h) => sum + parseFloat(h.amount.toString()),
    0
  );

  const alreadyPaid = parseFloat(studentFee.paid_amount.toString());
  const newDue      = Math.max(0, newTotal - alreadyPaid);

  // Derive status
  let newStatus = studentFee.status;
  if (newDue <= 0) {
    newStatus = "paid";
  } else if (alreadyPaid > 0) {
    newStatus = "partial";
  } else if (newStatus !== "overdue") {
    newStatus = "pending";
  }

  studentFee.fee_snapshot  = newSnapshot;
  studentFee.total_amount  = mongoose.Types.Decimal128.fromString(newTotal.toFixed(2));
  studentFee.due_amount    = mongoose.Types.Decimal128.fromString(newDue.toFixed(2));
  studentFee.status        = newStatus;

  await studentFee.save();
};

// ─── CRUD ─────────────────────────────────────────────────────────────────────

const createFeeTerm = async (data) => {
  const existing = await FeeTerm.findOne({
    institute_id:  data.institute_id,
    academic_year: data.academic_year,
    name:          data.name,
  });

  if (existing) {
    throw new CustomError(
      `A fee term with name '${data.name}' already exists for this institute and academic year`,
      statusCode.CONFLICT
    );
  }

  const feeTerm = new FeeTerm(data);
  await feeTerm.save();
  return feeTerm;
};

const createBulkFeeTerms = async (termsArray) => {
  const names  = termsArray.map((t) => t.name);
  const unique = new Set(names);
  if (unique.size !== names.length) {
    throw new CustomError(
      "Duplicate term names found in the batch",
      statusCode.BAD_REQUEST
    );
  }

  const insertedTerms = await FeeTerm.insertMany(termsArray);
  return insertedTerms;
};

const getAllFeeTerms = async (filters = {}) => {
  const query = {};
  if (filters.institute_id)  query.institute_id  = filters.institute_id;
  if (filters.academic_year) query.academic_year = filters.academic_year;
  if (filters.status)        query.status        = filters.status;

  return await FeeTerm.find(query)
    .populate("institute_id", "institute_name institute_code")
    .sort({ term_order: 1, start_date: 1 });
};

const getFeeTermById = async (id) => {
  const feeTerm = await FeeTerm.findById(id).populate(
    "institute_id",
    "institute_name institute_code"
  );
  if (!feeTerm) throw new CustomError("Fee term not found", statusCode.NOT_FOUND);
  return feeTerm;
};

const getFeeTermsByInstituteAndYear = async (instituteId, academicYear) => {
  return await FeeTerm.find({
    institute_id:  instituteId,
    academic_year: academicYear,
  })
    .populate("institute_id", "institute_name institute_code")
    .sort({ term_order: 1 });
};

/**
 * Update a fee term and cascade-recalculate every student-fee record
 * that references this term.
 *
 * Cascade logic:
 *  1. Save the updated term.
 *  2. Find all StudentFee docs that reference this term_id.
 *  3. For each, re-fetch its fee_structure, re-run frequency logic
 *     using the term's term_order, and save updated amounts/snapshot/status.
 */
const updateFeeTerm = async (id, updateData) => {
  const feeTerm = await FeeTerm.findById(id);
  if (!feeTerm) throw new CustomError("Fee term not found", statusCode.NOT_FOUND);

  // Apply field updates
  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) feeTerm[key] = updateData[key];
  });
  await feeTerm.save();

  // ── Cascade: recalculate all student fees for this term ───────────────────
  const affectedFees = await StudentFee.find({ term_id: id });

  if (affectedFees.length > 0) {
    // Group by fee_structure_id to avoid redundant DB lookups
    const structureCache = {};
    const termOrder = feeTerm.term_order || 1;

    await Promise.allSettled(
      affectedFees.map(async (sf) => {
        const structureId = sf.fee_structure_id.toString();
        if (!structureCache[structureId]) {
          structureCache[structureId] = await FeeStructure.findById(structureId);
        }
        const feeStructure = structureCache[structureId];
        if (!feeStructure) return; // skip orphaned records

        await recalculateStudentFee(sf, feeStructure, termOrder);
      })
    );
  }

  return feeTerm;
};

const deleteFeeTerm = async (id) => {
  const feeTerm = await FeeTerm.findById(id);
  if (!feeTerm) throw new CustomError("Fee term not found", statusCode.NOT_FOUND);

  await FeeTerm.findByIdAndDelete(id);
  return feeTerm;
};

module.exports = { 
  createFeeTerm,
  createBulkFeeTerms,
  getAllFeeTerms,
  getFeeTermById,
  getFeeTermsByInstituteAndYear,
  updateFeeTerm,
  deleteFeeTerm,
};






















































// const FeeTerm = require("../models/feeTerm.model");
// const CustomError = require("../exceptions/CustomError");
// const statusCode = require("../enums/statusCode");
  
// const createFeeTerm = async (data) => {
//   const existing = await FeeTerm.findOne({ 
//     institute_id: data.institute_id,
//     academic_year: data.academic_year, 
//     name: data.name,
//   });

//   if (existing) {
//     throw new CustomError(
//       `A fee term with name '${data.name}' already exists for this institute and academic year`,
//       statusCode.CONFLICT
//     );
//   }

//   const feeTerm = new FeeTerm(data);
//   await feeTerm.save();
//   return feeTerm;
// };

// const createBulkFeeTerms = async (termsArray) => {
//   // Validate no duplicates within the batch
//   const names = termsArray.map((t) => t.name);
//   const unique = new Set(names);
//   if (unique.size !== names.length) {
//     throw new CustomError(
//       "Duplicate term names found in the batch",
//       statusCode.BAD_REQUEST
//     );
//   }

//   const insertedTerms = await FeeTerm.insertMany(termsArray);
//   return insertedTerms;
// };

// const getAllFeeTerms = async (filters = {}) => {
//   const query = {};
//   if (filters.institute_id) query.institute_id = filters.institute_id;
//   if (filters.academic_year) query.academic_year = filters.academic_year;
//   if (filters.status) query.status = filters.status;

//   return await FeeTerm.find(query)
//     .populate("institute_id", "institute_name institute_code")
//     .sort({ term_order: 1, start_date: 1 });
// };

// const getFeeTermById = async (id) => {
//   const feeTerm = await FeeTerm.findById(id).populate("institute_id", "institute_name institute_code");

//   if (!feeTerm) {
//     throw new CustomError("Fee term not found", statusCode.NOT_FOUND);
//   }

//   return feeTerm;
// };

// const getFeeTermsByInstituteAndYear = async (instituteId, academicYear) => {
//   return await FeeTerm.find({
//     institute_id: instituteId,
//     academic_year: academicYear,
//   })
//     .populate("institute_id", "institute_name institute_code")
//     .sort({ term_order: 1 });
// };

// const updateFeeTerm = async (id, updateData) => {
//   const feeTerm = await FeeTerm.findById(id);

//   if (!feeTerm) {
//     throw new CustomError("Fee term not found", statusCode.NOT_FOUND);
//   }

//   Object.keys(updateData).forEach((key) => {
//     if (updateData[key] !== undefined) {
//       feeTerm[key] = updateData[key];
//     }
//   });

//   await feeTerm.save();
//   return feeTerm;
// };

// const deleteFeeTerm = async (id) => {
//   const feeTerm = await FeeTerm.findById(id);

//   if (!feeTerm) {
//     throw new CustomError("Fee term not found", statusCode.NOT_FOUND);
//   }

//   await FeeTerm.findByIdAndDelete(id);
//   return feeTerm;
// };

// module.exports = {
//   createFeeTerm,
//   createBulkFeeTerms,
//   getAllFeeTerms,
//   getFeeTermById,
//   getFeeTermsByInstituteAndYear,
//   updateFeeTerm,
//   deleteFeeTerm,
// };
