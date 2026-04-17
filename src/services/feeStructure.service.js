const FeeStructure = require("../models/feeStructure.model");
const StudentFee   = require("../models/studentFee.model");
const FeeTerm      = require("../models/feeTerm.model");
const CustomError  = require("../exceptions/CustomError");
const statusCode   = require("../enums/statusCode");
const mongoose     = require("mongoose");

// ─── Shared frequency helper ──────────────────────────────────────────────────
const shouldIncludeFeeHead = (frequency, termOrder) => {
  switch (frequency) {
    case "one_time":
    case "annual":
      return termOrder === 1;
    case "monthly":
      return true;
    case "quarterly":
      return termOrder % 3 === 1;
    case "half_yearly":
      return termOrder % 6 === 1;
    default:
      return true;
  }
};

/**
 * Recompute and save a single StudentFee document.
 * @param {Object} studentFee    - Mongoose StudentFee doc
 * @param {Object} feeStructure  - Mongoose FeeStructure doc (already updated)
 * @param {number} termOrder     - term's 1-based order
 */
const recalculateStudentFee = async (studentFee, feeStructure, termOrder) => {
  const applicableHeads = feeStructure.fee_heads.filter((h) =>
    shouldIncludeFeeHead(h.frequency, termOrder)
  );
  if (applicableHeads.length === 0) return;

  const newSnapshot = applicableHeads.map((h) => ({
    name:      h.name,
    amount:    h.amount,
    frequency: h.frequency,
  }));

  const newTotal    = applicableHeads.reduce(
    (sum, h) => sum + parseFloat(h.amount.toString()),
    0
  );
  const alreadyPaid = parseFloat(studentFee.paid_amount.toString());
  const newDue      = Math.max(0, newTotal - alreadyPaid);

  let newStatus = studentFee.status;
  if (newDue <= 0) {
    newStatus = "paid";
  } else if (alreadyPaid > 0) {
    newStatus = "partial";
  } else if (newStatus !== "overdue") {
    newStatus = "pending";
  }

  studentFee.fee_snapshot = newSnapshot;
  studentFee.total_amount = mongoose.Types.Decimal128.fromString(newTotal.toFixed(2));
  studentFee.due_amount   = mongoose.Types.Decimal128.fromString(newDue.toFixed(2));
  studentFee.status       = newStatus;

  await studentFee.save();
};

// ─── CRUD ─────────────────────────────────────────────────────────────────────

const createFeeStructure = async (data) => {
  // Build uniqueness query — scoped to batch OR class/section
  const uniqueQuery = {
    institute_id:  data.institute_id,
    academic_year: data.academic_year || null,
    status:        "active",
  };

  if (data.batch_id) {
    uniqueQuery.batch_id = data.batch_id;
  } else {
    uniqueQuery.class_id  = data.class_id;
    uniqueQuery.section_id = data.section_id || null;
    uniqueQuery.batch_id  = null;
  }

  const existing = await FeeStructure.findOne(uniqueQuery);
  if (existing) {
    throw new CustomError(
      "An active fee structure already exists for this class/batch/section and academic year",
      statusCode.CONFLICT
    );
  }

  delete data.total_annual_amount; // pre-save hook will compute it
  const feeStructure = new FeeStructure(data);
  await feeStructure.save();
  return feeStructure;
};

/**
 * Update a fee structure and cascade-recalculate every student-fee record
 * linked to this structure.
 *
 * Cascade logic:
 *  1. Apply field updates and save the structure (pre-save hook recomputes
 *     total_annual_amount automatically).
 *  2. Find all StudentFee docs with this fee_structure_id.
 *  3. For each, look up its FeeTerm (for term_order), re-run frequency logic,
 *     and save updated amounts / snapshot / status.
 */
const updateFeeStructure = async (id, updateData) => {
  const feeStructure = await FeeStructure.findById(id);
  if (!feeStructure) {
    throw new CustomError("Fee structure not found", statusCode.NOT_FOUND);
  }

  delete updateData.total_annual_amount; // pre-save hook will recompute
  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) feeStructure[key] = updateData[key];
  });
  await feeStructure.save(); // ← triggers pre-save hook for total_annual_amount

  // ── Cascade: recalculate all student fees for this structure ──────────────
  const affectedFees = await StudentFee.find({ fee_structure_id: id });

  if (affectedFees.length > 0) {
    // Cache FeeTerm lookups
    const termCache = {};

    await Promise.allSettled(
      affectedFees.map(async (sf) => {
        const termId = sf.term_id.toString();
        if (!termCache[termId]) {
          termCache[termId] = await FeeTerm.findById(termId);
        }
        const term = termCache[termId];
        if (!term) return; // skip orphaned records

        const termOrder = term.term_order || 1;
        await recalculateStudentFee(sf, feeStructure, termOrder);
      })
    );
  }

  return feeStructure;
};

const getAllFeeStructures = async (filters = {}) => {
  const query = {};
  if (filters.institute_id)  query.institute_id  = filters.institute_id;
  if (filters.class_id)      query.class_id      = filters.class_id;
  if (filters.batch_id)      query.batch_id      = filters.batch_id;
  if (filters.academic_year) query.academic_year = filters.academic_year;
  if (filters.status)        query.status        = filters.status;

  return await FeeStructure.find(query)
    .populate("institute_id", "institute_name institute_code")
    .populate("class_id",     "class_name")
    .populate("section_id",   "section_name")
    .populate("batch_id",     "batch_name start_time end_time")
    .sort({ created_at: -1 });
};

const getFeeStructureById = async (id) => {
  const feeStructure = await FeeStructure.findById(id)
    .populate("institute_id", "institute_name institute_code")
    .populate("class_id",     "class_name")
    .populate("section_id",   "section_name")
    .populate("batch_id",     "batch_name start_time end_time");

  if (!feeStructure) {
    throw new CustomError("Fee structure not found", statusCode.NOT_FOUND);
  }
  return feeStructure;
};

const getFeeStructuresByClass = async (classId, filters = {}) => {
  const query = { class_id: classId };
  if (filters.academic_year) query.academic_year = filters.academic_year;
  if (filters.status)        query.status        = filters.status;

  return await FeeStructure.find(query)
    .populate("institute_id", "institute_name institute_code")
    .populate("class_id",     "class_name")
    .populate("section_id",   "section_name")
    .populate("batch_id",     "batch_name start_time end_time")
    .sort({ created_at: -1 });
};

const getFeeStructuresByBatch = async (batchId, filters = {}) => {
  const query = { batch_id: batchId };
  if (filters.academic_year) query.academic_year = filters.academic_year;
  if (filters.status)        query.status        = filters.status;

  return await FeeStructure.find(query)
    .populate("institute_id", "institute_name institute_code")
    .populate("batch_id",     "batch_name start_time end_time")
    .sort({ created_at: -1 });
};

const deleteFeeStructure = async (id) => {
  const feeStructure = await FeeStructure.findById(id);
  if (!feeStructure) {
    throw new CustomError("Fee structure not found", statusCode.NOT_FOUND);
  }
  await FeeStructure.findByIdAndDelete(id);
  return feeStructure;
};

module.exports = {
  createFeeStructure,
  getAllFeeStructures,
  getFeeStructureById,
  getFeeStructuresByClass,
  getFeeStructuresByBatch,
  updateFeeStructure,
  deleteFeeStructure,
};




































// const FeeStructure = require("../models/feeStructure.model");
// const CustomError = require("../exceptions/CustomError");
// const statusCode = require("../enums/statusCode");
// const mongoose = require("mongoose"); 

// const createFeeStructure = async (data) => {
//   // Build uniqueness query — scoped to batch OR class/section
//   const uniqueQuery = {
//     institute_id: data.institute_id,
//     academic_year: data.academic_year || null,
//     status: "active",
//   };

//   if (data.batch_id) {
//     uniqueQuery.batch_id = data.batch_id;
//   } else {
//     uniqueQuery.class_id = data.class_id;
//     uniqueQuery.section_id = data.section_id || null;
//     uniqueQuery.batch_id = null;
//   }

//   const existing = await FeeStructure.findOne(uniqueQuery);

//   if (existing) {
//     throw new CustomError(
//       "An active fee structure already exists for this class/batch/section and academic year",
//       statusCode.CONFLICT
//     );
//   }

//   // Remove manual total — pre-save hook will compute it
//   delete data.total_annual_amount;

//   const feeStructure = new FeeStructure(data);
//   await feeStructure.save();
//   return feeStructure;
// };

// const updateFeeStructure = async (id, updateData) => {
//   const feeStructure = await FeeStructure.findById(id);

//   if (!feeStructure) {
//     throw new CustomError("Fee structure not found", statusCode.NOT_FOUND);
//   }

//   // Remove manual total — pre-save hook will recompute
//   delete updateData.total_annual_amount;

//   Object.keys(updateData).forEach((key) => {
//     if (updateData[key] !== undefined) {
//       feeStructure[key] = updateData[key];
//     }
//   });

//   await feeStructure.save();
//   return feeStructure;
// };

// const getAllFeeStructures = async (filters = {}) => {
//   const query = {};
//   if (filters.institute_id) query.institute_id = filters.institute_id;
//   if (filters.class_id) query.class_id = filters.class_id;
//   if (filters.batch_id) query.batch_id = filters.batch_id;
//   if (filters.academic_year) query.academic_year = filters.academic_year;
//   if (filters.status) query.status = filters.status;

//   return await FeeStructure.find(query)
//     .populate("institute_id", "institute_name institute_code")
//     .populate("class_id", "class_name")
//     .populate("section_id", "section_name")
//     // .populate("batch_id", "batch_name start_time end_time")
//     .populate("batch_id", "batch_name start_time end_time")
    
//     .sort({ created_at: -1 });
// };

// const getFeeStructureById = async (id) => {
//   const feeStructure = await FeeStructure.findById(id)
//     .populate("institute_id", "institute_name institute_code")
//     .populate("class_id", "class_name")
//     .populate("section_id", "section_name")
//     .populate("batch_id", "batch_name start_time end_time");

//   if (!feeStructure) {
//     throw new CustomError("Fee structure not found", statusCode.NOT_FOUND);
//   }

//   return feeStructure;
// };

// const getFeeStructuresByClass = async (classId, filters = {}) => {
//   const query = { class_id: classId };
//   if (filters.academic_year) query.academic_year = filters.academic_year;
//   if (filters.status) query.status = filters.status;

//   return await FeeStructure.find(query)
//     .populate("institute_id", "institute_name institute_code")
//     .populate("class_id", "class_name")
//     .populate("section_id", "section_name")
//     .populate("batch_id", "batch_name start_time end_time")
//     .sort({ created_at: -1 });
// };

// // Coaching-compatible: get fee structures by batch ID
// const getFeeStructuresByBatch = async (batchId, filters = {}) => {
//   const query = { batch_id: batchId };
//   if (filters.academic_year) query.academic_year = filters.academic_year;
//   if (filters.status) query.status = filters.status;

//   return await FeeStructure.find(query)
//     .populate("institute_id", "institute_name institute_code")
//     .populate("batch_id", "batch_name start_time end_time")
//     .sort({ created_at: -1 });
// };

// const deleteFeeStructure = async (id) => {
//   const feeStructure = await FeeStructure.findById(id);

//   if (!feeStructure) {
//     throw new CustomError("Fee structure not found", statusCode.NOT_FOUND);
//   }

//   await FeeStructure.findByIdAndDelete(id);
//   return feeStructure;
// };

// module.exports = {
//   createFeeStructure,
//   getAllFeeStructures,
//   getFeeStructureById,
//   getFeeStructuresByClass,
//   getFeeStructuresByBatch,
//   updateFeeStructure,
//   deleteFeeStructure,
// };
