const FeeStructure = require("../models/feeStructure.model");
const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");   
const mongoose = require("mongoose");

 
 
const createFeeStructure = async (data) => {
  const existing = await FeeStructure.findOne({
    institute_id: data.institute_id,
    class_id: data.class_id,
    section_id: data.section_id || null,
    academic_year: data.academic_year || null,
    status: "active",
  });

  if (existing) {
    throw new CustomError(
      "An active fee structure already exists for this class/section and academic year",
      statusCode.CONFLICT
    );
  }

  // Remove manual total — pre-save hook will compute it
  delete data.total_annual_amount;

  const feeStructure = new FeeStructure(data);
  await feeStructure.save();
  return feeStructure;
};

const updateFeeStructure = async (id, updateData) => {
  const feeStructure = await FeeStructure.findById(id);

  if (!feeStructure) {
    throw new CustomError("Fee structure not found", statusCode.NOT_FOUND);
  }

  // Remove manual total — pre-save hook will recompute
  delete updateData.total_annual_amount;

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      feeStructure[key] = updateData[key];
    }
  });

  await feeStructure.save(); // pre-save hook fires here
  return feeStructure;
};



const getAllFeeStructures = async (filters = {}) => {
  const query = {};
  if (filters.institute_id) query.institute_id = filters.institute_id;
  if (filters.class_id) query.class_id = filters.class_id;
  if (filters.academic_year) query.academic_year = filters.academic_year;
  if (filters.status) query.status = filters.status;

  return await FeeStructure.find(query)
    .populate("institute_id", "institute_name institute_code") 
    .populate("class_id", "class_name") 
    .populate("section_id", "section_name")
    .sort({ created_at: -1 });
};

const getFeeStructureById = async (id) => {
  const feeStructure = await FeeStructure.findById(id)
    .populate("institute_id", "institute_name institute_code")
    .populate("class_id", "class_name")
    .populate("section_id", "section_name");

  if (!feeStructure) {
    throw new CustomError("Fee structure not found", statusCode.NOT_FOUND);
  }

  return feeStructure;
};

const getFeeStructuresByClass = async (classId, filters = {}) => {
  const query = { class_id: classId };
  if (filters.academic_year) query.academic_year = filters.academic_year;
  if (filters.status) query.status = filters.status;

  return await FeeStructure.find(query)
    .populate("institute_id", "institute_name institute_code")
    .populate("class_id", "class_name")
    .populate("section_id", "section_name")
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
  updateFeeStructure,
  deleteFeeStructure,
};
