const StudentGuardians = require("../models/studentGuardians.model");
const mongoose = require("mongoose");

const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");

const createGuardian = async (guardianData) => {

  //guardians mobile number should be unique for a student
  const existingGuardian = await StudentGuardians.findOne({
    student_id: guardianData.student_id,
    mobile: guardianData.mobile,
  });
  if (existingGuardian) {
    throw new CustomError(
      "A guardian with this mobile number already exists for this student",
      statusCode.CONFLICT
    );
  }


  // If this is being set as primary, unset any existing primary guardians for this student
  if (guardianData.is_primary) {
    await StudentGuardians.updateMany(
      { student_id: guardianData.student_id, is_primary: true },
      { $set: { is_primary: false } }
    ); 
  }

  const guardian = new StudentGuardians({
    student_id: new mongoose.Types.ObjectId(guardianData.student_id),
    name: guardianData.name,
    relation: guardianData.relation,
    mobile: guardianData.mobile,
    email: guardianData.email || null,
    occupation: guardianData.occupation || null,
    is_primary: guardianData.is_primary || false,
  });

  await guardian.save();
  return guardian;
};

const getAllGuardians = async (filters = {}) => {
  const query = {};

  if (filters.student_id) query.student_id = filters.student_id;
  if (filters.relation) query.relation = filters.relation;
  if (filters.is_primary !== undefined) query.is_primary = filters.is_primary;

  const guardians = await StudentGuardians.find(query)
    .populate("student_id", "full_name student_code")
    .sort({ is_primary: -1, createdAt: -1 });

  return guardians;
};

const getGuardianById = async (guardianId) => {
  const guardian = await StudentGuardians.findById(guardianId).populate(
    "student_id",
    "full_name student_code"
  );

  if (!guardian) {
    throw new CustomError("Guardian not found", statusCode.NOT_FOUND);
  }

  return guardian;
};

const getGuardiansByStudentId = async (studentId) => {
  const guardians = await StudentGuardians.find({
    student_id: studentId,
  }).populate("student_id", "full_name student_code").sort({ is_primary: -1, createdAt: -1 });

  return guardians;
};

const getPrimaryGuardian = async (studentId) => {
  const guardian = await StudentGuardians.findOne({
    student_id: studentId,
    is_primary: true,
  }).populate("student_id", "full_name student_code");

  if (!guardian) {
    throw new CustomError(
      "Primary guardian not found for this student",
      statusCode.NOT_FOUND
    );
  }

  return guardian;
};

const updateGuardian = async (guardianId, updateData) => {
  const guardian = await StudentGuardians.findById(guardianId);

  if (!guardian) {
    throw new CustomError("Guardian not found", statusCode.NOT_FOUND);
  }

  // If setting this guardian as primary, unset other primary guardians for this student
  if (updateData.is_primary === true) {
    await StudentGuardians.updateMany(
      {
        student_id: guardian.student_id,
        _id: { $ne: guardianId },
        is_primary: true,
      },
      { $set: { is_primary: false } }
    );
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      guardian[key] = updateData[key];
    }
  });

  await guardian.save();
  return await StudentGuardians.findById(guardianId).populate(
    "student_id",
    "full_name student_code"
  );
};

const deleteGuardian = async (guardianId) => {
  const guardian = await StudentGuardians.findById(guardianId);

  if (!guardian) {
    throw new CustomError("Guardian not found", statusCode.NOT_FOUND);
  }

  await StudentGuardians.findByIdAndDelete(guardianId);
  return { message: "Guardian deleted successfully" };
};

module.exports = {
  createGuardian,
  getAllGuardians,
  getGuardianById,
  getGuardiansByStudentId,
  getPrimaryGuardian,
  updateGuardian,
  deleteGuardian,
};