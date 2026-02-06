const StudentAcademicMapping = require("../models/studentAcademicMapping.model");
const mongoose = require("mongoose");

const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");

const createMapping = async (mappingData) => {
  // Validation: school type requires class_id
  if (mappingData.mapping_type === "school" && !mappingData.class_id) {
    throw new CustomError(
      "class_id is required for school mapping",
      statusCode.BAD_REQUEST
    );
  }

  // Validation: coaching type requires class_id and batch_id
  if (mappingData.mapping_type === "coaching") {
    if (!mappingData.class_id) {
      throw new CustomError(
        "class_id is required for coaching mapping",
        statusCode.BAD_REQUEST
      );
    }
    if (!mappingData.batch_id) {
      throw new CustomError(
        "batch_id is required for coaching mapping",
        statusCode.BAD_REQUEST
      );
    }
  }

  // Check for existing active mapping for the same student and academic year
  const existingMapping = await StudentAcademicMapping.findOne({
    student_id: mappingData.student_id,
    academic_year: mappingData.academic_year,
    mapping_type: mappingData.mapping_type,
    status: "active",
  });

  if (existingMapping) {
    throw new CustomError(
      `Student already has an active ${mappingData.mapping_type} mapping for ${mappingData.academic_year}`,
      statusCode.CONFLICT
    );
  }

  const mapping = new StudentAcademicMapping({
    student_id: new mongoose.Types.ObjectId(mappingData.student_id),
    class_id: mappingData.class_id
      ? new mongoose.Types.ObjectId(mappingData.class_id)
      : null,
    section_id: mappingData.section_id
      ? new mongoose.Types.ObjectId(mappingData.section_id)
      : null,
    batch_id: mappingData.batch_id
      ? new mongoose.Types.ObjectId(mappingData.batch_id)
      : null,
    mapping_type: mappingData.mapping_type,
    academic_year: mappingData.academic_year,
    roll_number: mappingData.roll_number || null,
    joined_at: mappingData.joined_at || new Date(),
    status: "active",
  });

  await mapping.save();
  return mapping;
};

const getAllMappings = async (filters = {}) => {
  const query = {};

  if (filters.student_id) query.student_id = filters.student_id;
  if (filters.class_id) query.class_id = filters.class_id;
  if (filters.section_id) query.section_id = filters.section_id;
  if (filters.batch_id) query.batch_id = filters.batch_id;
  if (filters.mapping_type) query.mapping_type = filters.mapping_type;
  if (filters.academic_year) query.academic_year = filters.academic_year;
  if (filters.status) query.status = filters.status;

  const mappings = await StudentAcademicMapping.find(query)
    .populate("student_id", "full_name student_code")
    .populate("class_id", "class_name class_type academic_year")
    .populate("section_id", "section_name")
    .populate("batch_id", "batch_name start_time end_time")
    .sort({ academic_year: -1, createdAt: -1 });

  return mappings;
};

const getMappingById = async (mappingId) => {
  const mapping = await StudentAcademicMapping.findById(mappingId)
    .populate("student_id", "full_name student_code")
    .populate("class_id", "class_name class_type academic_year")
    .populate("section_id", "section_name")
    .populate("batch_id", "batch_name start_time end_time");

  if (!mapping) {
    throw new CustomError("Mapping not found", statusCode.NOT_FOUND);
  }

  return mapping;
};

// Get student's current active mappings
const getActiveStudentMappings = async (studentId) => {
  const mappings = await StudentAcademicMapping.find({
    student_id: studentId,
    status: "active",
  })
    .populate("class_id", "class_name class_type academic_year")
    .populate("section_id", "section_name")
    .populate("batch_id", "batch_name start_time end_time")
    .sort({ academic_year: -1 });

  return mappings;
};

// Get student's mapping history
const getStudentMappingHistory = async (studentId) => {
  const mappings = await StudentAcademicMapping.find({
    student_id: studentId,
  })
    .populate("class_id", "class_name class_type academic_year")
    .populate("section_id", "section_name")
    .populate("batch_id", "batch_name start_time end_time")
    .sort({ academic_year: -1, createdAt: -1 });

  return mappings;
};

// Get students by class/section/batch
const getStudentsByClass = async (
  classId,
  sectionId = null,
  academicYear = null
) => {
  const query = {
    class_id: classId,
    status: "active",
  };

  if (sectionId) {
    query.section_id = sectionId;
  }

  if (academicYear) {
    query.academic_year = academicYear;
  }

  const mappings = await StudentAcademicMapping.find(query)
    .populate("student_id", "full_name student_code date_of_birth")
    .populate("section_id", "section_name")
    .sort({ roll_number: 1 });

  return mappings;
};

// Get students by batch (for coaching)
const getStudentsByBatch = async (batchId, academicYear = null) => {
  const query = {
    batch_id: batchId,
    status: "active",
  };

  if (academicYear) {
    query.academic_year = academicYear;
  }

  const mappings = await StudentAcademicMapping.find(query)
    .populate("student_id", "full_name student_code date_of_birth")
    .populate("class_id", "class_name")
    .sort({ roll_number: 1 });

  return mappings;
};

const updateMapping = async (mappingId, updateData) => {
  const mapping = await StudentAcademicMapping.findById(mappingId);

  if (!mapping) {
    throw new CustomError("Mapping not found", statusCode.NOT_FOUND);
  }

  // Convert IDs to ObjectId if provided
  if (updateData.class_id) {
    updateData.class_id = new mongoose.Types.ObjectId(updateData.class_id);
  }
  if (updateData.section_id) {
    updateData.section_id = new mongoose.Types.ObjectId(updateData.section_id);
  }
  if (updateData.batch_id) {
    updateData.batch_id = new mongoose.Types.ObjectId(updateData.batch_id);
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      mapping[key] = updateData[key];
    }
  });

  await mapping.save();
  return await StudentAcademicMapping.findById(mappingId)
    .populate("student_id", "full_name student_code")
    .populate("class_id", "class_name class_type academic_year")
    .populate("section_id", "section_name")
    .populate("batch_id", "batch_name start_time end_time");
};

const deleteMapping = async (mappingId) => {
  const mapping = await StudentAcademicMapping.findById(mappingId);

  if (!mapping) {
    throw new CustomError("Mapping not found", statusCode.NOT_FOUND);
  }

  await StudentAcademicMapping.findByIdAndDelete(mappingId);
  return { message: "Mapping deleted successfully" };
};

// Promote student to next class
const promoteStudent = async (mappingId, newClassId, newSectionId = null) => {
  const mapping = await StudentAcademicMapping.findById(mappingId);

  if (!mapping) {
    throw new CustomError("Mapping not found", statusCode.NOT_FOUND);
  }

  if (mapping.status !== "active") {
    throw new CustomError(
      "Can only promote students with active status",
      statusCode.BAD_REQUEST
    );
  }

  // Mark current mapping as promoted
  mapping.status = "promoted";
  mapping.left_at = new Date();
  await mapping.save();

  return { message: "Student promoted successfully. Create new mapping for next academic year." };
};

module.exports = {
  createMapping,
  getAllMappings,
  getMappingById,
  getActiveStudentMappings,
  getStudentMappingHistory,
  getStudentsByClass,
  getStudentsByBatch,
  updateMapping,
  deleteMapping,
  promoteStudent,
};