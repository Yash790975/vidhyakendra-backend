 const ClassTeacherAssignments = require("../models/classTeacherAssignments.model");
const mongoose = require("mongoose");

const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");

const createAssignment = async (assignmentData) => {
  // Validation: subject_teacher role must have subject_id
  if (
    assignmentData.role === "subject_teacher" &&
    !assignmentData.subject_id
  ) {
    throw new CustomError(
      "subject_id is required for subject_teacher role",
      statusCode.BAD_REQUEST
    );
  }

  // Check for duplicate active assignment
  const existingAssignment = await ClassTeacherAssignments.findOne({
    teacher_id: assignmentData.teacher_id,
    class_id: assignmentData.class_id,
    section_id: assignmentData.section_id || null,
    subject_id: assignmentData.subject_id || null,
    role: assignmentData.role,
    academic_year: assignmentData.academic_year,
    status: "active",
  });

  if (existingAssignment) {
    throw new CustomError(
      "This assignment already exists for the given academic year",
      statusCode.CONFLICT
    );
  }

  const assignment = new ClassTeacherAssignments({
    teacher_id: new mongoose.Types.ObjectId(assignmentData.teacher_id),
    class_id: new mongoose.Types.ObjectId(assignmentData.class_id),
    section_id: assignmentData.section_id
      ? new mongoose.Types.ObjectId(assignmentData.section_id)
      : null,
    subject_id: assignmentData.subject_id
      ? new mongoose.Types.ObjectId(assignmentData.subject_id)
      : null,
    role: assignmentData.role,
    academic_year: assignmentData.academic_year,
    assigned_from: assignmentData.assigned_from || new Date(),
    assigned_to: assignmentData.assigned_to || null,
    status: "active",
  });

  await assignment.save();
  return assignment;
};

const getAllAssignments = async (filters = {}) => {
  const query = {};

  if (filters.teacher_id) query.teacher_id = filters.teacher_id;
  if (filters.class_id) query.class_id = filters.class_id;
  if (filters.section_id) query.section_id = filters.section_id;
  if (filters.subject_id) query.subject_id = filters.subject_id;
  if (filters.role) query.role = filters.role;
  if (filters.academic_year) query.academic_year = filters.academic_year;
  if (filters.status) query.status = filters.status;

  const assignments = await ClassTeacherAssignments.find(query)
    .populate("teacher_id", "full_name teacher_code")
    .populate("class_id", "class_name class_type academic_year")
    .populate("section_id", "section_name")
    .populate("subject_id", "subject_name subject_code")
    .sort({ createdAt: -1 });

  return assignments;
};

const getAssignmentById = async (assignmentId) => {
  const assignment = await ClassTeacherAssignments.findById(assignmentId)
    .populate("teacher_id", "full_name teacher_code")
    .populate("class_id", "class_name class_type academic_year")
    .populate("section_id", "section_name")
    .populate("subject_id", "subject_name subject_code");

  if (!assignment) {
    throw new CustomError("Assignment not found", statusCode.NOT_FOUND);
  }

  return assignment;
};

// Get all assignments for a specific teacher
const getAssignmentsByTeacherId = async (teacherId, academicYear = null) => {
  const query = { teacher_id: teacherId };
  if (academicYear) {
    query.academic_year = academicYear;
  }

  const assignments = await ClassTeacherAssignments.find(query)
    .populate("class_id", "class_name class_type academic_year")
    .populate("section_id", "section_name")
    .populate("subject_id", "subject_name subject_code")
    .sort({ academic_year: -1, createdAt: -1 });

  return assignments;
};

// Get all assignments for a specific class
const getAssignmentsByClassId = async (classId, academicYear = null) => {
  const query = { class_id: classId };
  if (academicYear) {
    query.academic_year = academicYear;
  }

  const assignments = await ClassTeacherAssignments.find(query)
    .populate("teacher_id", "full_name teacher_code")
    .populate("section_id", "section_name")
    .populate("subject_id", "subject_name subject_code")
    .sort({ role: 1, createdAt: -1 });

  return assignments;
};

// Get assignments by role
const getAssignmentsByRole = async (role, academicYear = null) => {
  const query = { role: role };
  if (academicYear) {
    query.academic_year = academicYear;
  }

  const assignments = await ClassTeacherAssignments.find(query)
    .populate("teacher_id", "full_name teacher_code")
    .populate("class_id", "class_name class_type academic_year")
    .populate("section_id", "section_name")
    .populate("subject_id", "subject_name subject_code")
    .sort({ createdAt: -1 });

  return assignments;
};

// Get subject teachers for a specific subject
const getSubjectTeachers = async (subjectId, academicYear = null) => {
  const query = { subject_id: subjectId, role: "subject_teacher" };
  if (academicYear) {
    query.academic_year = academicYear;
  }

  const assignments = await ClassTeacherAssignments.find(query)
    .populate("teacher_id", "full_name teacher_code")
    .populate("class_id", "class_name class_type academic_year")
    .populate("section_id", "section_name")
    .sort({ createdAt: -1 });

  return assignments;
};

const updateAssignment = async (assignmentId, updateData) => {
  const assignment = await ClassTeacherAssignments.findById(assignmentId);

  if (!assignment) {
    throw new CustomError("Assignment not found", statusCode.NOT_FOUND);
  }

  // Validation: subject_teacher role must have subject_id
  if (updateData.role === "subject_teacher" && !updateData.subject_id && !assignment.subject_id) {
    throw new CustomError(
      "subject_id is required for subject_teacher role",
      statusCode.BAD_REQUEST
    );
  }

  // Handle archiving
  if (updateData.status === "archived" && assignment.status !== "archived") {
    updateData.archived_at = new Date();
  }

  // Convert IDs to ObjectId if provided
  if (updateData.section_id) {
    updateData.section_id = new mongoose.Types.ObjectId(updateData.section_id);
  }
  if (updateData.subject_id) {
    updateData.subject_id = new mongoose.Types.ObjectId(updateData.subject_id);
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      assignment[key] = updateData[key];
    }
  });

  await assignment.save();
  return await ClassTeacherAssignments.findById(assignmentId)
    .populate("teacher_id", "full_name teacher_code")
    .populate("class_id", "class_name class_type academic_year")
    .populate("section_id", "section_name")
    .populate("subject_id", "subject_name subject_code");
};

const deleteAssignment = async (assignmentId) => {
  const assignment = await ClassTeacherAssignments.findById(assignmentId);

  if (!assignment) {
    throw new CustomError("Assignment not found", statusCode.NOT_FOUND);
  }

  await ClassTeacherAssignments.findByIdAndDelete(assignmentId);
  return assignment;
};

// End assignment (set assigned_to date and status to inactive)
const endAssignment = async (assignmentId, endDate = null) => {
  const assignment = await ClassTeacherAssignments.findById(assignmentId);

  if (!assignment) {
    throw new CustomError("Assignment not found", statusCode.NOT_FOUND);
  }

  if (assignment.status === "inactive") {
    throw new CustomError(
      "Assignment is already inactive",
      statusCode.BAD_REQUEST
    );
  }

  assignment.assigned_to = endDate || new Date();
  assignment.status = "inactive";
  await assignment.save();

  return await ClassTeacherAssignments.findById(assignmentId)
    .populate("teacher_id", "full_name teacher_code")
    .populate("class_id", "class_name class_type academic_year")
    .populate("section_id", "section_name")
    .populate("subject_id", "subject_name subject_code");
};

module.exports = {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  getAssignmentsByTeacherId,
  getAssignmentsByClassId,
  getAssignmentsByRole,
  getSubjectTeachers,
  updateAssignment,
  deleteAssignment,
  endAssignment,
};