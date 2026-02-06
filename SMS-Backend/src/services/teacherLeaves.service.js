
const TeacherLeaves = require('../models/teacherLeaves.model');
const statusCode = require('../enums/statusCode');
const mongoose = require('mongoose');

const createLeave = async (data) => {        
  const leave = new TeacherLeaves(data);
  await leave.save();
  
  const populated = await TeacherLeaves.findById(leave._id)
    .populate("teacher_id", "full_name teacher_code")
    .populate('approved_by', 'name email');
  
  return populated;
};

const getAllLeaves = async () => {
  const leaves = await TeacherLeaves.find()
    .populate("teacher_id", "full_name teacher_code")
    .populate('approved_by', 'name email')
    .sort({ from_date: -1 });
  
  return leaves;
};

const getLeaveById = async (id) => {
  const leave = await TeacherLeaves.findById(id)
    .populate("teacher_id", "full_name teacher_code")
    .populate('approved_by', 'name email');
  
  return leave;
}; 

const getLeavesByTeacherId = async (teacherId) => {
  const leaves = await TeacherLeaves.find({ teacher_id: teacherId })
    .populate("teacher_id", "full_name teacher_code")
    .populate('approved_by', 'name email')
    .sort({ from_date: -1 });
  
  return leaves;
};

const getLeavesByStatus = async (status) => {
  const leaves = await TeacherLeaves.find({ status })
    .populate("teacher_id", "full_name teacher_code")
    .populate('approved_by', 'name email')
    .sort({ from_date: -1 });
  
  return leaves;
};

const updateLeave = async (id, data) => {
  const leave = await TeacherLeaves.findById(id);
  if (!leave) {
    const error = new Error('Leave not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  Object.assign(leave, data);
  await leave.save();

  const updated = await TeacherLeaves.findById(id)
    .populate("teacher_id", "full_name teacher_code")
    .populate('approved_by', 'name email');

  return updated;
};

const approveLeave = async (id, adminId) => {
  const leave = await TeacherLeaves.findById(id);
  if (!leave) {
    const error = new Error('Leave not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  if (leave.status !== 'pending') {
    const error = new Error('Leave is already processed');
    error.statusCode = statusCode.BAD_REQUEST;
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

  leave.status = 'approved';
  leave.approved_by = adminId;
  leave.approved_at = new Date();
  await leave.save();

  const approved = await TeacherLeaves.findById(id)
    .populate("teacher_id", "full_name teacher_code")
    .populate('approved_by', 'name email');

  return approved;
};

const rejectLeave = async (id, adminId, rejectionReason) => {
  const leave = await TeacherLeaves.findById(id);
  if (!leave) {
    const error = new Error('Leave not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  if (leave.status !== 'pending') {
    const error = new Error('Leave is already processed');
    error.statusCode = statusCode.BAD_REQUEST;
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

  leave.status = 'rejected';
  leave.approved_by = adminId;
  leave.approved_at = new Date();
  leave.rejection_reason = rejectionReason;
  await leave.save();

  const rejected = await TeacherLeaves.findById(id)
    .populate("teacher_id", "full_name teacher_code")
    .populate('approved_by', 'name email');

  return rejected;
};

const deleteLeave = async (id) => {
  const leave = await TeacherLeaves.findByIdAndDelete(id);
  if (!leave) {
    const error = new Error('Leave not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  return { message: 'Leave deleted successfully' };
};

module.exports = {
  createLeave,
  getAllLeaves,
  getLeaveById,
  getLeavesByTeacherId,
  getLeavesByStatus,
  updateLeave,
  approveLeave,
  rejectLeave,
  deleteLeave
};

































































// const TeacherLeaves = require('../models/teacherLeaves.model');
// const statusCode = require('../enums/statusCode');

// const createLeave = async (data) => {      
//   const leave = new TeacherLeaves(data);
//   await leave.save();
  
//   const populated = await TeacherLeaves.findById(leave._id)
//     .populate("teacher_id", "full_name teacher_code")
//     .populate('approved_by', 'name email')
  
//   return populated;
// };

// const getAllLeaves = async () => {
//   const leaves = await TeacherLeaves.find()
//     .populate("teacher_id", "full_name teacher_code")
//     .populate('approved_by', 'name email')
//     .sort({ from_date: -1 });
  
//   return leaves;
// };

// const getLeaveById = async (id) => {
//   const leave = await TeacherLeaves.findById(id)
//     .populate("teacher_id", "full_name teacher_code")
//     .populate('approved_by', 'name email');
  
//   return leave;
// }; 

// const getLeavesByTeacherId = async (teacherId) => {
//   const leaves = await TeacherLeaves.find({ teacher_id: teacherId })
//     .populate("teacher_id", "full_name teacher_code")
//     .populate('approved_by', 'name email')
//     .sort({ from_date: -1 });
  
//   return leaves;
// };

// const getLeavesByStatus = async (status) => {
//   const leaves = await TeacherLeaves.find({ status })
//     .populate("teacher_id", "full_name teacher_code")
//     .populate('approved_by', 'name email')
//     .sort({ from_date: -1 });
  
//   return leaves;
// };

// const updateLeave = async (id, data) => {
//   const leave = await TeacherLeaves.findById(id);
//   if (!leave) {
//     const error = new Error('Leave not found');
//     error.statusCode = statusCode.NOT_FOUND;
//     throw error;
//   }

//   Object.assign(leave, data);
//   await leave.save();

//   const updated = await TeacherLeaves.findById(id)
//     .populate("teacher_id", "full_name teacher_code")
//     .populate('approved_by', 'name email');

//   return updated;
// };






// const approveLeave = async (id, adminId) => {
//   const leave = await TeacherLeaves.findById(id);
//   if (!leave) {
//     const error = new Error('Leave not found');
//     error.statusCode = statusCode.NOT_FOUND;
//     throw error;
//   }

//   if (leave.status !== 'pending') {
//     const error = new Error('Leave is already processed');
//     error.statusCode = statusCode.BAD_REQUEST;
//     throw error;
//   }

//   leave.status = 'approved';
//   leave.approved_by = adminId;
//   leave.approved_at = new Date();
//   await leave.save();

//   const approved = await TeacherLeaves.findById(id)
//     .populate("teacher_id", "full_name teacher_code")
//     .populate('approved_by', 'name email');

//   return approved;
// };

// const rejectLeave = async (id, adminId, rejectionReason) => {
//   const leave = await TeacherLeaves.findById(id);
//   if (!leave) {
//     const error = new Error('Leave not found');
//     error.statusCode = statusCode.NOT_FOUND;
//     throw error;
//   }

//   if (leave.status !== 'pending') {
//     const error = new Error('Leave is already processed');
//     error.statusCode = statusCode.BAD_REQUEST;
//     throw error;
//   }

//   leave.status = 'rejected';
//   leave.approved_by = adminId;
//   leave.approved_at = new Date();
//   leave.rejection_reason = rejectionReason;
//   await leave.save();

//   const rejected = await TeacherLeaves.findById(id)
//     .populate("teacher_id", "full_name teacher_code")
//     .populate('approved_by', 'name email');

//   return rejected;
// };

// const deleteLeave = async (id) => {
//   const leave = await TeacherLeaves.findByIdAndDelete(id);
//   if (!leave) {
//     const error = new Error('Leave not found');
//     error.statusCode = statusCode.NOT_FOUND;
//     throw error;
//   }

//   return { message: 'Leave deleted successfully' };
// };

// module.exports = {
//   createLeave,
//   getAllLeaves,
//   getLeaveById,
//   getLeavesByTeacherId,
//   getLeavesByStatus,
//   updateLeave,
//   approveLeave,
//   rejectLeave,
//   deleteLeave
// };











































































// const TeacherLeaves = require('../models/teacherLeaves.model');
// const statusCode = require('../enums/statusCode');

// const createLeave = async (data) => {    
//   const leave = new TeacherLeaves(data);
//   await leave.save();
  
//   const populated = await TeacherLeaves.findById(leave._id)
//     .populate("teacher_id", "full_name teacher_code")
//     .populate('approved_by', 'name email')
  
//   return populated;
// };

// const getAllLeaves = async () => {
//   const leaves = await TeacherLeaves.find()
//     .populate("teacher_id", "full_name teacher_code")
//     .populate('approved_by', 'name email')
//     .sort({ from_date: -1 });
  
//   return leaves;
// };

// const getLeaveById = async (id) => {
//   const leave = await TeacherLeaves.findById(id)
//     .populate("teacher_id", "full_name teacher_code")
//     .populate('approved_by', 'name email');
  
//   return leave;
// }; 

// const getLeavesByTeacherId = async (teacherId) => {
//   const leaves = await TeacherLeaves.find({ teacher_id: teacherId })
//     .populate("teacher_id", "full_name teacher_code")
//     .populate('approved_by', 'name email')
//     .sort({ from_date: -1 });
  
//   return leaves;
// };

// const getLeavesByStatus = async (status) => {
//   const leaves = await TeacherLeaves.find({ status })
//     .populate("teacher_id", "full_name teacher_code")
//     .populate('approved_by', 'name email')
//     .sort({ from_date: -1 });
  
//   return leaves;
// };

// const updateLeave = async (id, data) => {
//   const leave = await TeacherLeaves.findById(id);
//   if (!leave) {
//     const error = new Error('Leave not found');
//     error.statusCode = statusCode.NOT_FOUND;
//     throw error; 
//   }

//   Object.assign(leave, data);
//   await leave.save();

//   const updated = await TeacherLeaves.findById(id)
//     .populate("teacher_id", "full_name teacher_code")
//     .populate('approved_by', 'name email');

//   return updated;
// };




// const approveLeave = async (id, approvedBy) => {
//   const leave = await TeacherLeaves.findById(id);
//   if (!leave) {
//     const error = new Error('Leave not found');
//     error.statusCode = statusCode.NOT_FOUND;
//     throw error;
//   }

//   if (leave.status !== 'pending') {
//     const error = new Error('Leave is already processed');
//     error.statusCode = statusCode.BAD_REQUEST;
//     throw error;
//   }

//   leave.status = 'approved';
//   leave.approved_by = approvedBy;
//   leave.approved_at = new Date();
//   await leave.save();

//   const approved = await TeacherLeaves.findById(id)
//     .populate("teacher_id", "full_name teacher_code")
//     .populate('approved_by', 'name email');

//   return approved;
// };

// const rejectLeave = async (id, approvedBy, rejectionReason) => {
//   const leave = await TeacherLeaves.findById(id);
//   if (!leave) {
//     const error = new Error('Leave not found');
//     error.statusCode = statusCode.NOT_FOUND;
//     throw error;
//   }

//   if (leave.status !== 'pending') {
//     const error = new Error('Leave is already processed');
//     error.statusCode = statusCode.BAD_REQUEST;
//     throw error;
//   }

//   leave.status = 'rejected';
//   leave.approved_by = approvedBy;
//   leave.approved_at = new Date();
//   leave.rejection_reason = rejectionReason;
//   await leave.save();

//   const rejected = await TeacherLeaves.findById(id)
//     .populate("teacher_id", "full_name teacher_code")
//     .populate('approved_by', 'name email');

//   return rejected;
// };

// const deleteLeave = async (id) => {
//   const leave = await TeacherLeaves.findByIdAndDelete(id);
//   if (!leave) {
//     const error = new Error('Leave not found');
//     error.statusCode = statusCode.NOT_FOUND;
//     throw error;
//   }

//   return { message: 'Leave deleted successfully' };
// };

// module.exports = {
//   createLeave,
//   getAllLeaves,
//   getLeaveById,
//   getLeavesByTeacherId,
//   getLeavesByStatus,
//   updateLeave,
//   approveLeave,
//   rejectLeave,
//   deleteLeave
// };
