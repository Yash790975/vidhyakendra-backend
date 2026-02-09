const StudentAttendance = require('../models/studentAttendance.model');
const statusCode = require('../enums/statusCode'); 
const CustomError = require('../exceptions/CustomError');
const mongoose = require('mongoose');


// ===============================
// ✅ Reusable marked_by populate   
// ===============================
const markedByPopulate = {
  path: 'marked_by',
  select: 'email mobile teacher_id',
  populate: {
    path: 'teacher_id',
    select: 'full_name'
  }
};

// ===============================
// ✅ Flatten helper
// ===============================
const flattenMarkedBy = (doc) => {
  if (!doc) return doc;

  const process = (item) => {
    if (item?.marked_by?.teacher_id) {
      item.marked_by.full_name = item.marked_by.teacher_id.full_name;
      delete item.marked_by.teacher_id;
    }
    return item;
  };

  return Array.isArray(doc) ? doc.map(process) : process(doc);
};


// ===============================
// Create attendance
// ===============================
const createAttendance = async (data) => {
  const TeacherAuth = mongoose.model('teacher_auth');
  const teacherExists = await TeacherAuth.findById(data.marked_by);

  if (!teacherExists) {
    throw new CustomError('Teacher not found', statusCode.NOT_FOUND);
  }

  const Student = mongoose.model('StudentsMaster');
  const studentExists = await Student.findById(data.student_id);

  if (!studentExists) {
    throw new CustomError('Student not found', statusCode.NOT_FOUND);
  }

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
    .populate('student_id', 'full_name student_code student_type')
    .populate({
      path: 'class_id',
      select: 'class_name class_level academic_year class_type class_teacher_id',
      populate: {
        path: 'class_teacher_id',
        select: 'teacher_code full_name'
      }
    })
    .populate({
      path: 'section_id',
      select: 'section_name class_teacher_id',
      populate: {
        path: 'class_teacher_id',
        select: 'teacher_code full_name'
      }
    })
    .populate('batch_id', 'batch_name')
    .populate(markedByPopulate)
    .lean();

  return flattenMarkedBy(populated);
};


// ===============================
// Bulk create attendance
// ===============================
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
    errors,
    total: attendances.length,
    created: results.length,
    failed: errors.length
  };
};


// ===============================
// Get all attendance
// ===============================
const getAllAttendance = async () => {
  const attendance = await StudentAttendance.find()
    .populate('student_id', 'full_name student_code student_type')
    .populate({
      path: 'class_id',
      select: 'class_name class_level academic_year class_type class_teacher_id',
      populate: {
        path: 'class_teacher_id',
        select: 'teacher_code full_name'
      }
    })
    .populate({
      path: 'section_id',
      select: 'section_name class_teacher_id',
      populate: {
        path: 'class_teacher_id',
        select: 'teacher_code full_name'
      }
    })
    .populate('batch_id', 'batch_name')
    .populate(markedByPopulate)
    .sort({ date: -1 })
    .lean();

  return flattenMarkedBy(attendance);
};


// ===============================
const getAttendanceById = async (id) => {
  const attendance = await StudentAttendance.findById(id)
    .populate('student_id', 'full_name student_code student_type')
    .populate({
      path: 'class_id',
      select: 'class_name class_level academic_year class_type class_teacher_id',
      populate: {
        path: 'class_teacher_id',
        select: 'teacher_code full_name'
      }
    })
    .populate({
      path: 'section_id',
      select: 'section_name class_teacher_id',
      populate: {
        path: 'class_teacher_id',
        select: 'teacher_code full_name'
      }
    })
    .populate('batch_id', 'batch_name')
    .populate(markedByPopulate)
    .lean();

  if (!attendance) {
    throw new CustomError('Attendance record not found', statusCode.NOT_FOUND);
  }

  return flattenMarkedBy(attendance);
};


// ===============================
const getAttendanceByStudentId = async (studentId) => {
  const attendance = await StudentAttendance.find({ student_id: studentId })
    .populate('student_id', 'full_name student_code student_type')
    .populate({
      path: 'class_id',
      select: 'class_name class_level academic_year class_type class_teacher_id',
      populate: {
        path: 'class_teacher_id',
        select: 'teacher_code full_name'
      }
    })
    .populate({
      path: 'section_id',
      select: 'section_name class_teacher_id',
      populate: {
        path: 'class_teacher_id',
        select: 'teacher_code full_name'
      }
    })
    .populate('batch_id', 'batch_name')
    .populate(markedByPopulate)
    .sort({ date: -1 })
    .lean();

  return flattenMarkedBy(attendance);
};


// ===============================
const getAttendanceByClassId = async (classId) => {
  const attendance = await StudentAttendance.find({ class_id: classId })
    .populate('student_id', 'full_name student_code student_type')
    .populate({
      path: 'class_id',
      select: 'class_name class_level academic_year class_type class_teacher_id',
      populate: {
        path: 'class_teacher_id',
        select: 'teacher_code full_name'
      }
    })
    .populate({
      path: 'section_id',
      select: 'section_name class_teacher_id',
      populate: {
        path: 'class_teacher_id',
        select: 'teacher_code full_name'
      }
    })
    .populate('batch_id', 'batch_name')
    .populate(markedByPopulate)
    .sort({ date: -1 })
    .lean();

  return flattenMarkedBy(attendance);
};


// ===============================
const getAttendanceByDate = async (date) => {
  const attendance = await StudentAttendance.find({ date })
    .populate('student_id', 'full_name student_code student_type')  
    .populate({
      path: 'class_id',
      select: 'class_name class_level academic_year class_type class_teacher_id',
      populate: {
        path: 'class_teacher_id',
        select: 'teacher_code full_name'
      }
    })
    .populate({
      path: 'section_id',
      select: 'section_name class_teacher_id',
      populate: {
        path: 'class_teacher_id',
        select: 'teacher_code full_name'
      }
    })
    .populate('batch_id', 'batch_name')
    .populate(markedByPopulate)
    .sort({ student_id: 1 })
    .lean();

  return flattenMarkedBy(attendance);
};


// ===============================
const getAttendanceByDateRange = async (startDate, endDate) => {
  const attendance = await StudentAttendance.find({
    date: { $gte: startDate, $lte: endDate }
  })
    .populate('student_id', 'full_name student_code student_type')
    .populate({
      path: 'class_id',
      select: 'class_name class_level academic_year class_type class_teacher_id',
      populate: {
        path: 'class_teacher_id',
        select: 'teacher_code full_name'
      }
    })
    .populate({
      path: 'section_id',
      select: 'section_name class_teacher_id',
      populate: {
        path: 'class_teacher_id',
        select: 'teacher_code full_name'
      }
    })
    .populate('batch_id', 'batch_name')
    .populate(markedByPopulate)
    .sort({ date: -1 })
    .lean();

  return flattenMarkedBy(attendance);
};


// ===============================
const getAttendanceByTeacherId = async (teacherId) => {
  const attendance = await StudentAttendance.find({ marked_by: teacherId })
    .populate('student_id', 'full_name student_code student_type')
    .populate({
      path: 'class_id',
      select: 'class_name class_level academic_year class_type class_teacher_id',
      populate: {
        path: 'class_teacher_id',
        select: 'teacher_code full_name'
      }
    })
    .populate({
      path: 'section_id',
      select: 'section_name class_teacher_id',
      populate: {
        path: 'class_teacher_id',
        select: 'teacher_code full_name'
      }
    })
    .populate('batch_id', 'batch_name')
    .populate(markedByPopulate)
    .sort({ date: -1 })
    .lean();

  return flattenMarkedBy(attendance);
};


// ===============================
const getAttendanceByStatus = async (status) => {
  const attendance = await StudentAttendance.find({ status })
    .populate('student_id', 'full_name student_code student_type')
    .populate({
      path: 'class_id',
      select: 'class_name class_level academic_year class_type class_teacher_id',
      populate: {
        path: 'class_teacher_id',
        select: 'teacher_code full_name'
      }
    })
    .populate({
      path: 'section_id',
      select: 'section_name class_teacher_id',
      populate: {
        path: 'class_teacher_id',
        select: 'teacher_code full_name'
      }
    })
    .populate('batch_id', 'batch_name')
    .populate(markedByPopulate)
    .sort({ date: -1 })
    .lean();

  return flattenMarkedBy(attendance);
};


// ===============================
const updateAttendance = async (id, data) => {
  const attendance = await StudentAttendance.findById(id);

  if (!attendance) {
    throw new CustomError('Attendance record not found', statusCode.NOT_FOUND);
  }

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
    .populate('student_id', 'full_name student_code student_type')
    .populate({
      path: 'class_id',
      select: 'class_name class_level academic_year class_type class_teacher_id',
      populate: {
        path: 'class_teacher_id',
        select: 'teacher_code full_name'
      }
    })
    .populate({ 
      path: 'section_id',
      select: 'section_name class_teacher_id',
      populate: {
        path: 'class_teacher_id',
        select: 'teacher_code full_name'
      }
    })
    .populate('batch_id', 'batch_name')
    .populate(markedByPopulate)
    .lean();

  return flattenMarkedBy(updated);
};


// ===============================
const deleteAttendance = async (id) => {
  const attendance = await StudentAttendance.findByIdAndDelete(id);

  if (!attendance) {
    throw new CustomError('Attendance record not found', statusCode.NOT_FOUND);
  }

  return { message: 'Attendance record deleted successfully' };
};


// ===============================
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

  stats.attendance_percentage =
    stats.total > 0
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

