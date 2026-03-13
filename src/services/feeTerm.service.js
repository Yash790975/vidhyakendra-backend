const FeeTerm = require("../models/feeTerm.model");
const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");
 
const createFeeTerm = async (data) => {
  const existing = await FeeTerm.findOne({
    institute_id: data.institute_id,
    academic_year: data.academic_year, 
    name: data.name,
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
  // Validate no duplicates within the batch
  const names = termsArray.map((t) => t.name);
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
  if (filters.institute_id) query.institute_id = filters.institute_id;
  if (filters.academic_year) query.academic_year = filters.academic_year;
  if (filters.status) query.status = filters.status;

  return await FeeTerm.find(query)
    .populate("institute_id", "institute_name institute_code")
    .sort({ term_order: 1, start_date: 1 });
};

const getFeeTermById = async (id) => {
  const feeTerm = await FeeTerm.findById(id).populate("institute_id", "institute_name institute_code");

  if (!feeTerm) {
    throw new CustomError("Fee term not found", statusCode.NOT_FOUND);
  }

  return feeTerm;
};

const getFeeTermsByInstituteAndYear = async (instituteId, academicYear) => {
  return await FeeTerm.find({
    institute_id: instituteId,
    academic_year: academicYear,
  })
    .populate("institute_id", "institute_name institute_code")
    .sort({ term_order: 1 });
};

const updateFeeTerm = async (id, updateData) => {
  const feeTerm = await FeeTerm.findById(id);

  if (!feeTerm) {
    throw new CustomError("Fee term not found", statusCode.NOT_FOUND);
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      feeTerm[key] = updateData[key];
    }
  });

  await feeTerm.save();
  return feeTerm;
};

const deleteFeeTerm = async (id) => {
  const feeTerm = await FeeTerm.findById(id);

  if (!feeTerm) {
    throw new CustomError("Fee term not found", statusCode.NOT_FOUND);
  }

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
