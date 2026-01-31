const TeacherAttendance = require('../models/teacherAttendance.model');
const statusCode = require('../enums/statusCode');

/* =====================================================
   HELPERS
===================================================== */

// Parse "10:35AM" OR ISO date into Date
const parseTimeWithDate = (date, timeStr) => {
  if (!timeStr) return null;

  // Already a valid date string
  if (!isNaN(Date.parse(timeStr))) {
    return new Date(timeStr);
  }

  // Handle "10:35AM", "07:00PM"
  const dateObj = new Date(date);
  const match = timeStr.match(/(\d+):(\d+)(AM|PM)/i);

  if (!match) return null;

  let [_, hours, minutes, period] = match;
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);

  if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
  if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;

  dateObj.setHours(hours, minutes, 0, 0);
  return dateObj;
};

// Format Date -> "10:35AM" (IST)
// const formatTime = (date) => {
//   if (!date) return null;

//   // Convert UTC → IST
//   // const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);

//   let hours = istDate.getHours();
//   const minutes = istDate.getMinutes().toString().padStart(2, '0');
//   const ampm = hours >= 12 ? 'PM' : 'AM';

//   hours = hours % 12 || 12;

//   return `${hours}:${minutes}${ampm}`;
// };
// Just format hours/minutes, do NOT add timezone
const formatTime = (date) => {
  if (!date) return null;

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12;

  return `${hours}:${minutes}${ampm}`;
};


// Format attendance document
const formatAttendance = (doc) => {
  const obj = doc.toObject();
  return {
    ...obj,
    check_in_time: formatTime(obj.check_in_time),
    check_out_time: formatTime(obj.check_out_time),
  };
};

/* =====================================================
   CREATE
===================================================== */

const createAttendance = async (data) => {
  const existingAttendance = await TeacherAttendance.findOne({
    teacher_id: data.teacher_id,
    date: data.date,
  });

  if (existingAttendance) {
    const error = new Error('Attendance already marked for this date');
    error.statusCode = statusCode.CONFLICT;
    throw error;
  }

  data.check_in_time = parseTimeWithDate(data.date, data.check_in_time);
  data.check_out_time = parseTimeWithDate(data.date, data.check_out_time);

  const attendance = new TeacherAttendance(data);
  await attendance.save();

  const populated = await TeacherAttendance.findById(attendance._id)
    .populate('teacher_id', 'full_name teacher_code');

  return formatAttendance(populated); 
};

/* =====================================================
   GET
===================================================== */

const getAllAttendance = async () => {
  const attendance = await TeacherAttendance.find()
    .populate('teacher_id', 'full_name teacher_code')
    .sort({ date: -1 });

  return attendance.map(formatAttendance);
};

const getAttendanceById = async (id) => {
  const attendance = await TeacherAttendance.findById(id)
    .populate('teacher_id', 'full_name teacher_code');

  return attendance ? formatAttendance(attendance) : null;
};

const getAttendanceByTeacherId = async (teacherId) => {
  const attendance = await TeacherAttendance.find({ teacher_id: teacherId })
    .populate('teacher_id', 'full_name teacher_code')
    .sort({ date: -1 });

  return attendance.map(formatAttendance);
};

const getAttendanceByDate = async (date) => {
  const attendance = await TeacherAttendance.find({ date })
    .populate('teacher_id', 'full_name teacher_code');

  return attendance.map(formatAttendance);
};

const getAttendanceByDateRange = async (startDate, endDate) => {
  const attendance = await TeacherAttendance.find({
    date: { $gte: startDate, $lte: endDate },
  })
    .populate('teacher_id', 'full_name teacher_code')
    .sort({ date: -1 });

  return attendance.map(formatAttendance);
};

/* =====================================================
   UPDATE
===================================================== */

const updateAttendance = async (id, data) => {
  const attendance = await TeacherAttendance.findById(id);

  if (!attendance) {
    const error = new Error('Attendance not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  if (data.check_in_time) {
    data.check_in_time = parseTimeWithDate(
      data.date || attendance.date,
      data.check_in_time
    );
  }

  if (data.check_out_time) {
    data.check_out_time = parseTimeWithDate(
      data.date || attendance.date,
      data.check_out_time
    );
  }

  Object.assign(attendance, data);
  await attendance.save();

  const updated = await TeacherAttendance.findById(id)
    .populate('teacher_id', 'full_name teacher_code');

  return formatAttendance(updated);
};

/* =====================================================
   DELETE
===================================================== */

const deleteAttendance = async (id) => {
  const attendance = await TeacherAttendance.findByIdAndDelete(id);

  if (!attendance) {
    const error = new Error('Attendance not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  return { message: 'Attendance deleted successfully' };
};

/* =====================================================
   EXPORTS
===================================================== */

module.exports = {
  createAttendance,
  getAllAttendance,
  getAttendanceById,
  getAttendanceByTeacherId,
  getAttendanceByDate,
  getAttendanceByDateRange,
  updateAttendance,
  deleteAttendance,
};


























































// const TeacherAttendance = require('../models/teacherAttendance.model');
// const statusCode = require('../enums/statusCode');
 




// const parseTimeWithDate = (date, timeStr) => {
//   if (!timeStr) return null;

//   // If already a valid date string
//   if (!isNaN(Date.parse(timeStr))) {
//     return new Date(timeStr);
//   }

//   // Handle "10:35AM", "07:00PM"
//   const dateObj = new Date(date);
//   const match = timeStr.match(/(\d+):(\d+)(AM|PM)/i);

//   if (!match) return null;

//   let [_, hours, minutes, period] = match;
//   hours = parseInt(hours);
//   minutes = parseInt(minutes);

//   if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
//   if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;

//   dateObj.setHours(hours, minutes, 0, 0);
//   return dateObj;
// };




// // const createAttendance = async (data) => {
// //   // Check if attendance already exists for this teacher on this date
// //   const existingAttendance = await TeacherAttendance.findOne({
// //     teacher_id: data.teacher_id,
// //     date: data.date
// //   });

// //   if (existingAttendance) {
// //     const error = new Error('Attendance already marked for this date');
// //     error.statusCode = statusCode.CONFLICT;
// //     throw error; 
// //   }

// //   const attendance = new TeacherAttendance(data);
// //   await attendance.save();
  
// //   const populated = await TeacherAttendance.findById(attendance._id)
// //     .populate("teacher_id", "full_name teacher_code");
  
// //   return populated;
// // };

// const createAttendance = async (data) => {
//   const existingAttendance = await TeacherAttendance.findOne({
//     teacher_id: data.teacher_id,
//     date: data.date
//   });

//   if (existingAttendance) {
//     const error = new Error('Attendance already marked for this date');
//     error.statusCode = statusCode.CONFLICT;
//     throw error;
//   }

//   data.check_in_time = parseTimeWithDate(data.date, data.check_in_time);
//   data.check_out_time = parseTimeWithDate(data.date, data.check_out_time);

//   const attendance = new TeacherAttendance(data);
//   await attendance.save();

//   return TeacherAttendance.findById(attendance._id)
//     .populate('teacher_id', 'name email mobile');
// };



// const getAllAttendance = async () => {
//   const attendance = await TeacherAttendance.find()
//     .populate("teacher_id", "full_name teacher_code")
//     .sort({ date: -1 });
  
//   return attendance;
// };

// const getAttendanceById = async (id) => {
//   const attendance = await TeacherAttendance.findById(id)
//     .populate("teacher_id", "full_name teacher_code");
  
//   return attendance;
// };

// const getAttendanceByTeacherId = async (teacherId) => {
//   const attendance = await TeacherAttendance.find({ teacher_id: teacherId })
//     .populate("teacher_id", "full_name teacher_code")
//     .sort({ date: -1 });
  
//   return attendance;
// };

// const getAttendanceByDate = async (date) => {
//   const attendance = await TeacherAttendance.find({ date })
//     .populate("teacher_id", "full_name teacher_code");
  
//   return attendance;
// };

// const getAttendanceByDateRange = async (startDate, endDate) => {
//   const attendance = await TeacherAttendance.find({
//     date: { $gte: startDate, $lte: endDate }
//   })
//     .populate("teacher_id", "full_name teacher_code")
//     .sort({ date: -1 });
  
//   return attendance;
// };

// const updateAttendance = async (id, data) => {
//   const attendance = await TeacherAttendance.findById(id);
//   if (!attendance) {
//     const error = new Error('Attendance not found');
//     error.statusCode = statusCode.NOT_FOUND;
//     throw error;
//   }

//   Object.assign(attendance, data);
//   await attendance.save();

//   const updated = await TeacherAttendance.findById(id)
//     .populate("teacher_id", "full_name teacher_code");

//   return updated;
// };

// const deleteAttendance = async (id) => {
//   const attendance = await TeacherAttendance.findByIdAndDelete(id);
//   if (!attendance) {
//     const error = new Error('Attendance not found');
//     error.statusCode = statusCode.NOT_FOUND;
//     throw error;
//   }
 
//   return { message: 'Attendance deleted successfully' };
// };

// module.exports = {
//   createAttendance,
//   getAllAttendance,
//   getAttendanceById,
//   getAttendanceByTeacherId,
//   getAttendanceByDate,
//   getAttendanceByDateRange,
//   updateAttendance,
//   deleteAttendance
// };
