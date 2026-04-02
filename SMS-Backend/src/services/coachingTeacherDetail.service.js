// src/services/coachingTeacherDetail.service.js

const CoachingTeacherDetail = require('../models/coachingTeacherDetail.model');
const Teacher = require('../models/teachersMaster.model');
const statusCode = require('../enums/statusCode');
 
// Create coaching teacher detail
const createDetail = async (data) => { 
  // Check if teacher exists
  const teacher = await Teacher.findById(data.teacher_id);
  if (!teacher) {
    const error = new Error('Teacher not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  // Check if detail already exists for this teacher
  const existingDetail = await CoachingTeacherDetail.findOne({ teacher_id: data.teacher_id });
  if (existingDetail) {
    const error = new Error('Coaching teacher detail already exists for this teacher');
    error.statusCode = statusCode.CONFLICT;
    throw error;
  }

  // Create detail
  const detail = new CoachingTeacherDetail(data);
  await detail.save();

  // Populate teacher details
  const populatedDetail = await CoachingTeacherDetail.findById(detail._id)
    .populate("teacher_id", "full_name teacher_code");

  return populatedDetail;
};

// Get all details
const getAllDetails = async () => {
  const details = await CoachingTeacherDetail.find()
    .populate("teacher_id", "full_name teacher_code")
    .populate('batch_ids', 'batch_name batch_code');
  
  return details;
};

// Get detail by ID
const getDetailById = async (id) => {
  const detail = await CoachingTeacherDetail.findById(id)
    .populate("teacher_id", "full_name teacher_code")
    .populate('batch_ids', 'batch_name batch_code');
  
  return detail;
};

// Get detail by teacher ID
const getDetailByTeacherId = async (teacherId) => {
  const detail = await CoachingTeacherDetail.findOne({ teacher_id: teacherId })
    .populate("teacher_id", "full_name teacher_code")
    .populate('batch_ids', 'batch_name batch_code');
  
  return detail;
};

// Get details by role
const getDetailsByRole = async (role) => {
  const details = await CoachingTeacherDetail.find({ role })
    .populate("teacher_id", "full_name teacher_code")
    .populate('batch_ids', 'batch_name batch_code');
  
  return details;
};

// Get details by subject
const getDetailsBySubject = async (subject) => {
  const details = await CoachingTeacherDetail.find({ subjects: subject })
    .populate("teacher_id", "full_name teacher_code")
    .populate('batch_ids', 'batch_name batch_code');
  
  return details;
};

// Get details by batch ID
const getDetailsByBatchId = async (batchId) => {
  const details = await CoachingTeacherDetail.find({ batch_ids: batchId })
    .populate("teacher_id", "full_name teacher_code")
    .populate('batch_ids', 'batch_name batch_code');
  
  return details;
};

// Get details by payout model
const getDetailsByPayoutModel = async (payoutModel) => {
  const details = await CoachingTeacherDetail.find({ payout_model: payoutModel })
    .populate("teacher_id", "full_name teacher_code")
    .populate('batch_ids', 'batch_name batch_code');
  
  return details;
};

// Update detail
const updateDetail = async (id, data) => {
  const detail = await CoachingTeacherDetail.findById(id);
  if (!detail) {
    const error = new Error('Detail not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  Object.assign(detail, data);
  await detail.save();

  const updatedDetail = await CoachingTeacherDetail.findById(id)
    .populate("teacher_id", "full_name teacher_code")
    .populate('batch_ids', 'batch_name batch_code');

  return updatedDetail;
};

// Add batch to teacher
const addBatch = async (id, batchId) => {
  const detail = await CoachingTeacherDetail.findById(id);
  if (!detail) {
    const error = new Error('Detail not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  // Check if batch already exists
  if (detail.batch_ids && detail.batch_ids.includes(batchId)) {
    const error = new Error('Batch already assigned to this teacher');
    error.statusCode = statusCode.CONFLICT;
    throw error;
  }

  // Add batch
  if (!detail.batch_ids) {
    detail.batch_ids = [];
  }
  detail.batch_ids.push(batchId);
  await detail.save();

  const updatedDetail = await CoachingTeacherDetail.findById(id)
    .populate("teacher_id", "full_name teacher_code")
    .populate('batch_ids', 'batch_name batch_code');

  return updatedDetail;
};

// Remove batch from teacher
const removeBatch = async (id, batchId) => {
  const detail = await CoachingTeacherDetail.findById(id);
  if (!detail) {
    const error = new Error('Detail not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  // Remove batch
  if (detail.batch_ids) {
    detail.batch_ids = detail.batch_ids.filter(bid => bid.toString() !== batchId);
    await detail.save();
  }

  const updatedDetail = await CoachingTeacherDetail.findById(id)
    .populate("teacher_id", "full_name teacher_code")
    .populate('batch_ids', 'batch_name batch_code');

  return updatedDetail;
};

// Delete detail
const deleteDetail = async (id) => {
  const detail = await CoachingTeacherDetail.findByIdAndDelete(id);
  if (!detail) {
    const error = new Error('Detail not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  return { message: 'Coaching teacher detail deleted successfully' };
};

// Delete detail by teacher ID
const deleteDetailByTeacherId = async (teacherId) => {
  const detail = await CoachingTeacherDetail.findOneAndDelete({ teacher_id: teacherId });
  if (!detail) {
    const error = new Error('Detail not found for this teacher');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  return { message: 'Coaching teacher detail deleted successfully' };
};

module.exports = {
  createDetail,
  getAllDetails,
  getDetailById,
  getDetailByTeacherId,
  getDetailsByRole,
  getDetailsBySubject,
  getDetailsByBatchId,
  getDetailsByPayoutModel,
  updateDetail,
  addBatch,
  removeBatch,
  deleteDetail,
  deleteDetailByTeacherId
};