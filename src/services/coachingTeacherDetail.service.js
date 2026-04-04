const CoachingTeacherDetail = require('../models/coachingTeacherDetail.model');
const Teacher = require('../models/teachersMaster.model');
const statusCode = require('../enums/statusCode');

// Shared populate helper
const populateDetail = (query) =>
  query
    .populate("teacher_id", "full_name teacher_code")
    .populate("institute_id", "institute_name institute_code")  
    .populate('batch_ids', 'batch_name batch_code');

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
  const existingDetail = await CoachingTeacherDetail.findOne({
    teacher_id: data.teacher_id
  });
  if (existingDetail) {
    const error = new Error('Coaching teacher detail already exists for this teacher');
    error.statusCode = statusCode.CONFLICT;
    throw error;
  }

  const detail = new CoachingTeacherDetail(data);
  await detail.save();

  return await populateDetail(CoachingTeacherDetail.findById(detail._id));
};

// Get all details
const getAllDetails = async (filters = {}) => {
  const query = {};

  if (filters.institute_id) query.institute_id = filters.institute_id;  
  if (filters.role) query.role = filters.role;

  return await populateDetail(CoachingTeacherDetail.find(query));
};

// Get detail by ID
const getDetailById = async (id) => {
  return await populateDetail(CoachingTeacherDetail.findById(id));
};

// Get detail by teacher ID
const getDetailByTeacherId = async (teacherId) => {
  return await populateDetail(
    CoachingTeacherDetail.findOne({ teacher_id: teacherId })
  );
};

// Get details by role
const getDetailsByRole = async (role, instituteId = null) => {
  const query = { role };
  if (instituteId) query.institute_id = instituteId;         

  return await populateDetail(CoachingTeacherDetail.find(query));
};

// Get details by subject
const getDetailsBySubject = async (subject, instituteId = null) => {
  const query = { subjects: subject };
  if (instituteId) query.institute_id = instituteId;         

  return await populateDetail(CoachingTeacherDetail.find(query));
};

// Get details by batch ID
const getDetailsByBatchId = async (batchId, instituteId = null) => {
  const query = { batch_ids: batchId };
  if (instituteId) query.institute_id = instituteId;         

  return await populateDetail(CoachingTeacherDetail.find(query));
};

// Get details by payout model
const getDetailsByPayoutModel = async (payoutModel, instituteId = null) => {
  const query = { payout_model: payoutModel };
  if (instituteId) query.institute_id = instituteId;         

  return await populateDetail(CoachingTeacherDetail.find(query));
};

// Get all details by institute ID                          
const getDetailsByInstituteId = async (instituteId) => {
  return await populateDetail(
    CoachingTeacherDetail.find({ institute_id: instituteId })
  );
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

  return await populateDetail(CoachingTeacherDetail.findById(id));
};

// Add batch to teacher
const addBatch = async (id, batchId) => {
  const detail = await CoachingTeacherDetail.findById(id);
  if (!detail) {
    const error = new Error('Detail not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  if (detail.batch_ids && detail.batch_ids.includes(batchId)) {
    const error = new Error('Batch already assigned to this teacher');
    error.statusCode = statusCode.CONFLICT;
    throw error;
  }

  if (!detail.batch_ids) detail.batch_ids = [];
  detail.batch_ids.push(batchId);
  await detail.save();

  return await populateDetail(CoachingTeacherDetail.findById(id));
};

// Remove batch from teacher
const removeBatch = async (id, batchId) => {
  const detail = await CoachingTeacherDetail.findById(id);
  if (!detail) {
    const error = new Error('Detail not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  if (detail.batch_ids) {
    detail.batch_ids = detail.batch_ids.filter(
      (bid) => bid.toString() !== batchId
    );
    await detail.save();
  }

  return await populateDetail(CoachingTeacherDetail.findById(id));
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
  const detail = await CoachingTeacherDetail.findOneAndDelete({
    teacher_id: teacherId
  });
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
  getDetailsByInstituteId,    
  updateDetail,
  addBatch,
  removeBatch,
  deleteDetail,
  deleteDetailByTeacherId
};