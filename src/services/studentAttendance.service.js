const StudentAttendance = require('../models/studentAttendance.model');
const statusCode = require('../enums/statusCode');
const CustomError = require('../exceptions/CustomError');
const mongoose = require('mongoose');

// Create attendance
const createAttendance = async (data) => {
  // Verify that the teacher exists
  const TeacherAuth = mongoose.model('teacher_auth');
  const teacherExists = await TeacherAuth.findById(data.marked_by);
  
  if (!teacherExists) {
    throw new CustomError('Teacher not found', statusCode.NOT_FOUND);
  }

  // Verify that the student exists
  const Student = mongoose.model('students_master');
  const studentExists = await Student.findById(data.student_id);
  
  if (!studentExists) {
    throw new CustomError('Student not found', statusCode.NOT_FOUND);
  }

  // Check if attendance already exists for this student on this date
  const existing = await StudentAttendance.findOne({
    student_id: data.student_id,
    date: data.date
  });

  if (existing) {
    throw new CustomError(
      'Attendance already exists for this student on this date',
      statusCode.CONFLICT
    );
  }

  const attendance = new StudentAttendance(data);
  await attendance.save();

  const populated = await StudentAttendance.findById(attendance._id)
    .populate('student_id', 'first_name last_name student_code email')
    .populate('class_id', 'class_name')
    .populate('section_id', 'section_name')
    .populate('batch_id', 'batch_name')
    .populate('marked_by', 'email full_name');

  return populated;
};

// Bulk create attendance
const bulkCreateAttendance = async (attendances) => {
  const results = [];
  const errors = [];

  for (let i = 0; i < attendances.length; i++) {
    try {
      const attendance = await createAttendance(attendances[i]);
      results.push(attendance);
    } catch (error) {
      errors.push({
        index: i,
        student_id: attendances[i].student_id,
        error: error.message
      });
    }
  }

  return {
    success: results,
    errors: errors,
    total: attendances.length,
    created: results.length,
    failed: errors.length
  };
};

// Get all attendance records
const getAllAttendance = async () => {
  const attendance = await StudentAttendance.find()
    .populate('student_id', 'first_name last_name student_code email')
    .populate('class_id', 'class_name')
    .populate('section_id', 'section_name')
    .populate('batch_id', 'batch_name')
    .populate('marked_by', 'email full_name')
    .sort({ date: -1 });

  return attendance;
};

// Get attendance by ID
const getAttendanceById = async (id) => {
  const attendance = await StudentAttendance.findById(id)
    .populate('student_id', 'first_name last_name student_code email')
    .populate('class_id', 'class_name')
    .populate('section_id', 'section_name')
    .populate('batch_id', 'batch_name')
    .populate('marked_by', 'email full_name');

  if (!attendance) {
    throw new CustomError('Attendance record not found', statusCode.NOT_FOUND);
  }

  return attendance;
};

// Get attendance by student ID
const getAttendanceByStudentId = async (studentId) => {
  const attendance = await StudentAttendance.find({ student_id: studentId })
    .populate('student_id', 'first_name last_name student_code email')
    .populate('class_id', 'class_name')
    .populate('section_id', 'section_name')
    .populate('batch_id', 'batch_name')
    .populate('marked_by', 'email full_name')
    .sort({ date: -1 });

  return attendance;
};

// Get attendance by class ID
const getAttendanceByClassId = async (classId) => {
  const attendance = await StudentAttendance.find({ class_id: classId })
    .populate('student_id', 'first_name last_name student_code email')
    .populate('class_id', 'class_name')
    .populate('section_id', 'section_name')
    .populate('batch_id', 'batch_name')
    .populate('marked_by', 'email full_name')
    .sort({ date: -1 });

  return attendance;
};

// Get attendance by date
const getAttendanceByDate = async (date) => {
  const attendance = await StudentAttendance.find({ date })
    .populate('student_id', 'first_name last_name student_code email')
    .populate('class_id', 'class_name')
    .populate('section_id', 'section_name')
    .populate('batch_id', 'batch_name')
    .populate('marked_by', 'email full_name')
    .sort({ student_id: 1 });

  return attendance;
};

// Get attendance by date range
const getAttendanceByDateRange = async (startDate, endDate) => {
  const attendance = await StudentAttendance.find({
    date: { $gte: startDate, $lte: endDate }
  })
    .populate('student_id', 'first_name last_name student_code email')
    .populate('class_id', 'class_name')
    .populate('section_id', 'section_name')
    .populate('batch_id', 'batch_name')
    .populate('marked_by', 'email full_name')
    .sort({ date: -1 });

  return attendance;
};

// Get attendance by teacher ID
const getAttendanceByTeacherId = async (teacherId) => {
  const attendance = await StudentAttendance.find({ marked_by: teacherId })
    .populate('student_id', 'first_name last_name student_code email')
    .populate('class_id', 'class_name')
    .populate('section_id', 'section_name')
    .populate('batch_id', 'batch_name')
    .populate('marked_by', 'email full_name')
    .sort({ date: -1 });

  return attendance;
};

// Get attendance by status
const getAttendanceByStatus = async (status) => {
  const attendance = await StudentAttendance.find({ status })
    .populate('student_id', 'first_name last_name student_code email')
    .populate('class_id', 'class_name')
    .populate('section_id', 'section_name')
    .populate('batch_id', 'batch_name')
    .populate('marked_by', 'email full_name')
    .sort({ date: -1 });

  return attendance;
};

// Update attendance
const updateAttendance = async (id, data) => {
  const attendance = await StudentAttendance.findById(id);
  
  if (!attendance) {
    throw new CustomError('Attendance record not found', statusCode.NOT_FOUND);
  }

  // Verify teacher if marked_by is being updated
  if (data.marked_by) {
    const TeacherAuth = mongoose.model('teacher_auth');
    const teacherExists = await TeacherAuth.findById(data.marked_by);
    
    if (!teacherExists) {
      throw new CustomError('Teacher not found', statusCode.NOT_FOUND);
    }
  }

  Object.assign(attendance, data);
  await attendance.save();

  const updated = await StudentAttendance.findById(id)
    .populate('student_id', 'first_name last_name student_code email')
    .populate('class_id', 'class_name')
    .populate('section_id', 'section_name')
    .populate('batch_id', 'batch_name')
    .populate('marked_by', 'email full_name');

  return updated;
};

// Delete attendance
const deleteAttendance = async (id) => {
  const attendance = await StudentAttendance.findByIdAndDelete(id);
  
  if (!attendance) {
    throw new CustomError('Attendance record not found', statusCode.NOT_FOUND);
  }

  return { message: 'Attendance record deleted successfully' };
};

// Get attendance statistics by student
const getAttendanceStatsByStudent = async (studentId, startDate = null, endDate = null) => {
  const query = { student_id: studentId };
  
  if (startDate && endDate) {
    query.date = { $gte: startDate, $lte: endDate };
  }

  const attendance = await StudentAttendance.find(query);

  const stats = {
    total: attendance.length,
    present: attendance.filter(a => a.status === 'present').length,
    absent: attendance.filter(a => a.status === 'absent').length,
    leave: attendance.filter(a => a.status === 'leave').length
  };

  stats.attendance_percentage = stats.total > 0 
    ? ((stats.present / stats.total) * 100).toFixed(2) 
    : 0;

  return stats;
};

module.exports = {
  createAttendance,
  bulkCreateAttendance,
  getAllAttendance,
  getAttendanceById,
  getAttendanceByStudentId,
  getAttendanceByClassId,
  getAttendanceByDate,
  getAttendanceByDateRange,
  getAttendanceByTeacherId,
  getAttendanceByStatus,
  updateAttendance,
  deleteAttendance,
  getAttendanceStatsByStudent
};