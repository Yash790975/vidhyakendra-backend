const StudentStatusHistory = require('../models/studentStatusHistory.model');
const statusCode = require('../enums/statusCode');
const CustomError = require('../exceptions/CustomError');
const mongoose = require('mongoose');

// Create status history
const createStatusHistory = async (data) => {
  // Verify that the institute admin exists
  const InstituteAdmin = mongoose.model('institute_admins');
  const adminExists = await InstituteAdmin.findById(data.changed_by);
  
  if (!adminExists) {
    throw new CustomError('Institute admin not found', statusCode.NOT_FOUND);
  }

  // Verify that the student exists
  // const Student = mongoose.model('students_master');
  const Student = mongoose.model('StudentsMaster');
  const studentExists = await Student.findById(data.student_id);
  
  if (!studentExists) {
    throw new CustomError('Student not found', statusCode.NOT_FOUND);
  }

  const statusHistory = new StudentStatusHistory(data);
  await statusHistory.save();

  const populated = await StudentStatusHistory.findById(statusHistory._id)
    .populate('student_id', 'full_name student_code student_type status')
    .populate('changed_by', 'name email');

  return populated;
}; 

// Get all status histories
const getAllStatusHistories = async () => {
  const histories = await StudentStatusHistory.find()
    .populate('student_id', 'full_name student_code student_type status')
    .populate('changed_by', 'name email')
    .sort({ changed_at: -1 });

  return histories;
};

// Get status history by ID
const getStatusHistoryById = async (id) => {
  const history = await StudentStatusHistory.findById(id)
    .populate('student_id', 'full_name student_code student_type status')
    .populate('changed_by', 'name email');

  if (!history) {
    throw new CustomError('Status history not found', statusCode.NOT_FOUND);
  }

  return history;
};

// Get status histories by student ID
const getStatusHistoriesByStudentId = async (studentId) => {
  const histories = await StudentStatusHistory.find({ student_id: studentId })
    .populate('student_id', 'full_name student_code student_type status')
    .populate('changed_by', 'name email')
    .sort({ changed_at: -1 });

  return histories;
};

// Get status histories by status
const getStatusHistoriesByStatus = async (status) => {
  const histories = await StudentStatusHistory.find({ status })
    .populate('student_id', 'full_name student_code student_type status')
    .populate('changed_by', 'name email')
    .sort({ changed_at: -1 });

  return histories;
};

// Get status histories by admin ID
const getStatusHistoriesByAdminId = async (adminId) => {
  const histories = await StudentStatusHistory.find({ changed_by: adminId })
    .populate('student_id', 'full_name student_code student_type status')
    .populate('changed_by', 'name email')
    .sort({ changed_at: -1 });

  return histories;
};

// Update status history
const updateStatusHistory = async (id, data) => {
  const history = await StudentStatusHistory.findById(id);
  
  if (!history) {
    throw new CustomError('Status history not found', statusCode.NOT_FOUND);
  }

  // Verify admin if changed_by is being updated
  if (data.changed_by) {
    const InstituteAdmin = mongoose.model('institute_admins');
    const adminExists = await InstituteAdmin.findById(data.changed_by);
    
    if (!adminExists) {
      throw new CustomError('Institute admin not found', statusCode.NOT_FOUND);
    }
  }

  Object.assign(history, data);
  await history.save();

  const updated = await StudentStatusHistory.findById(id)
    .populate('student_id', 'full_name student_code student_type status')
    .populate('changed_by', 'name email');

  return updated;
};

// Delete status history
const deleteStatusHistory = async (id) => {
  const history = await StudentStatusHistory.findByIdAndDelete(id);
  
  if (!history) {
    throw new CustomError('Status history not found', statusCode.NOT_FOUND);
  }

  return { message: 'Status history deleted successfully' };
};

module.exports = {
  createStatusHistory,
  getAllStatusHistories,
  getStatusHistoryById,
  getStatusHistoriesByStudentId,
  getStatusHistoriesByStatus,
  getStatusHistoriesByAdminId,
  updateStatusHistory,
  deleteStatusHistory
};