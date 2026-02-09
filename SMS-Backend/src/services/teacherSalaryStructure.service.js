// services/teacherSalaryStructure.service.js
const TeacherSalaryStructure = require('../models/teacherSalaryStructure.model');
const statusCode = require('../enums/statusCode');    
const CustomError = require('../exceptions/CustomError');
const mongoose = require('mongoose');
   
// Create salary structure
const createSalaryStructure = async (data, adminId = null) => {
  // Check if salary structure already exists for this teacher
  const existing = await TeacherSalaryStructure.findOne({
    teacher_id: data.teacher_id,
  });

  if (existing) {
    throw new CustomError(
      "Salary structure already exists for this teacher", 
      statusCode.BAD_REQUEST
    );
  }

  // Verify admin if provided
  if (adminId) {
    const InstituteAdmin = mongoose.model("institute_admins");
    const adminExists = await InstituteAdmin.findById(adminId);
    
    if (!adminExists) {
      throw new CustomError('Institute admin not found', statusCode.NOT_FOUND);
    }
  }

  // Create new salary structure with approved_by if adminId is provided
  const salaryStructureData = {
    ...data,
    ...(adminId && {
      approved_by: adminId,
      approved_at: new Date()
    }) 
  };

  const salaryStructure = new TeacherSalaryStructure(salaryStructureData);
  await salaryStructure.save();

  // Populate and return
  const populated = await TeacherSalaryStructure.findById(salaryStructure._id)
    .populate("teacher_id", "full_name teacher_code")
    .populate("approved_by", "name email institute_id");

  return populated;
};

// Get all salary structures
const getAllSalaryStructures = async () => {
  const salaryStructures = await TeacherSalaryStructure.find()
    .populate("teacher_id", "full_name teacher_code")
    .populate('approved_by', 'name email institute_id');
  
  return salaryStructures;
};

// Get salary structure by ID
const getSalaryStructureById = async (id) => {
  const salaryStructure = await TeacherSalaryStructure.findById(id)
    .populate("teacher_id", "full_name teacher_code")
    .populate('approved_by', 'name email institute_id');
  
  return salaryStructure;
};

// Get salary structures by teacher ID
const getSalaryStructuresByTeacherId = async (teacherId) => {
  const salaryStructures = await TeacherSalaryStructure.find({ teacher_id: teacherId })
    .populate("teacher_id", "full_name teacher_code")
    .populate('approved_by', 'name email institute_id');
  
  return salaryStructures;
};

// Get active salary structure by teacher ID
const getActiveSalaryStructureByTeacherId = async (teacherId) => {
  const salaryStructure = await TeacherSalaryStructure.findOne({ 
    teacher_id: teacherId, 
    status: 'active' 
  })
    .populate("teacher_id", "full_name teacher_code")
    .populate('approved_by', 'name email institute_id');
  
  return salaryStructure;
};

// Update salary structure
const updateSalaryStructure = async (id, data, adminId = null) => {
  const salaryStructure = await TeacherSalaryStructure.findById(id);
  if (!salaryStructure) {
    const error = new Error('Salary structure not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  // Verify admin if provided
  if (adminId) {
    const InstituteAdmin = mongoose.model("institute_admins");
    const adminExists = await InstituteAdmin.findById(adminId);
    
    if (!adminExists) {
      throw new CustomError('Institute admin not found', statusCode.NOT_FOUND);
    }
    
    data.approved_by = adminId;
    data.approved_at = new Date();
  }

  Object.assign(salaryStructure, data);
  await salaryStructure.save();

  const updated = await TeacherSalaryStructure.findById(id)
    .populate("teacher_id", "full_name teacher_code")
    .populate('approved_by', 'name email institute_id');

  return updated;
};

// Approve salary structure
const approveSalaryStructure = async (id, adminId) => {
  const salaryStructure = await TeacherSalaryStructure.findById(id);
  if (!salaryStructure) { 
    const error = new Error('Salary structure not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  // Verify that the institute admin exists
  const InstituteAdmin = mongoose.model("institute_admins");
  const adminExists = await InstituteAdmin.findById(adminId);
  
  if (!adminExists) {
    const error = new Error('Institute admin not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  // Update approval details 
  salaryStructure.approved_by = adminId;
  salaryStructure.approved_at = new Date();
  salaryStructure.status = 'active'; // Set to active when approved
  await salaryStructure.save();

  const approved = await TeacherSalaryStructure.findById(id)
    .populate("teacher_id", "full_name teacher_code")
    .populate('approved_by', 'name email institute_id');

  return approved;
};

// Delete salary structure
const deleteSalaryStructure = async (id) => {
  const salaryStructure = await TeacherSalaryStructure.findByIdAndDelete(id);
  if (!salaryStructure) {
    const error = new Error('Salary structure not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  return { message: 'Salary structure deleted successfully' };
};

// Archive salary structure
const archiveSalaryStructure = async (id, adminId = null) => {
  const salaryStructure = await TeacherSalaryStructure.findById(id);
  if (!salaryStructure) {
    const error = new Error('Salary structure not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  // Verify admin if provided
  if (adminId) {
    const InstituteAdmin = mongoose.model("institute_admins");
    const adminExists = await InstituteAdmin.findById(adminId);
    
    if (!adminExists) {
      throw new CustomError('Institute admin not found', statusCode.NOT_FOUND);
    }
    
    salaryStructure.approved_by = adminId;
    salaryStructure.approved_at = new Date();
  }

  salaryStructure.status = 'archived';
  salaryStructure.archived_at = new Date();
  
  await salaryStructure.save();

  const archived = await TeacherSalaryStructure.findById(id)
    .populate("teacher_id", "full_name teacher_code")
    .populate('approved_by', 'name email institute_id');

  return archived;
};

module.exports = {
  createSalaryStructure,
  getAllSalaryStructures,
  getSalaryStructureById,
  getSalaryStructuresByTeacherId,
  getActiveSalaryStructureByTeacherId,
  updateSalaryStructure,
  approveSalaryStructure,
  deleteSalaryStructure,
  archiveSalaryStructure
};

