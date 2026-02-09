const ClassSubjectSchedule = require("../models/classSubjectSchedule.model");
const mongoose = require("mongoose");

const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");

const createSchedule = async (scheduleData) => {
  const schedule = new ClassSubjectSchedule({
    class_id: new mongoose.Types.ObjectId(scheduleData.class_id),

    section_id: scheduleData.section_id
      ? new mongoose.Types.ObjectId(scheduleData.section_id)
      : null,

    subject_id: new mongoose.Types.ObjectId(scheduleData.subject_id),

    teacher_id: scheduleData.teacher_id
      ? new mongoose.Types.ObjectId(scheduleData.teacher_id)
      : null,

    // ✅ NEW FIELD
    academic_year: scheduleData.academic_year,

    day_of_week: scheduleData.day_of_week || null,
    start_time: scheduleData.start_time,
    end_time: scheduleData.end_time,

    // ✅ RENAMED
    room_number: scheduleData.room_number || null,

    status: "active",
  });

  await schedule.save();
  return schedule;
};

const getAllSchedules = async (filters = {}) => {
  const query = {};

  if (filters.class_id) query.class_id = filters.class_id;
  if (filters.section_id) query.section_id = filters.section_id;
  if (filters.subject_id) query.subject_id = filters.subject_id;
  if (filters.teacher_id) query.teacher_id = filters.teacher_id;
  if (filters.day_of_week) query.day_of_week = filters.day_of_week;
  if (filters.status) query.status = filters.status;
  if (filters.academic_year) query.academic_year = filters.academic_year; // ✅ NEW

  const schedules = await ClassSubjectSchedule.find(query)
    .populate("class_id", "class_name class_type academic_year class_teacher_id")
    .populate({
      path: "section_id",
      select: "section_name class_teacher_id",
      populate: {
        path: "class_teacher_id",
        select: "teacher_code full_name",
      },
    })
    .populate("subject_id", "subject_name subject_code")
    .populate("teacher_id", "full_name teacher_code")
    .sort({ day_of_week: 1, start_time: 1 });

  return schedules;
};

const getScheduleById = async (scheduleId) => {
  const schedule = await ClassSubjectSchedule.findById(scheduleId)
    .populate("class_id", "class_name class_type academic_year class_teacher_id")
    .populate({
      path: "section_id",
      select: "section_name class_teacher_id",
      populate: {
        path: "class_teacher_id",
        select: "teacher_code full_name",
      },
    })
    .populate("subject_id", "subject_name subject_code")
    .populate("teacher_id", "full_name teacher_code");

  if (!schedule) {
    throw new CustomError("Schedule not found", statusCode.NOT_FOUND);
  }

  return schedule;
};

const getScheduleByClassId = async (classId, sectionId = null) => {
  const query = { class_id: classId };
  if (sectionId) query.section_id = sectionId;

  const schedules = await ClassSubjectSchedule.find(query)
    .populate({
      path: "section_id",
      select: "section_name class_teacher_id",
      populate: {
        path: "class_teacher_id",
        select: "teacher_code full_name",
      },
    })
    .populate("subject_id", "subject_name subject_code")
    .populate("teacher_id", "full_name teacher_code")
    .sort({ day_of_week: 1, start_time: 1 });

  return schedules;
};

const getScheduleByTeacherId = async (teacherId) => {
  return await ClassSubjectSchedule.find({ teacher_id: teacherId })
    .populate("class_id", "class_name class_type academic_year class_teacher_id")
    .populate({
      path: "section_id",
      select: "section_name class_teacher_id",
      populate: {
        path: "class_teacher_id",
        select: "teacher_code full_name",
      },
    })
    .populate("subject_id", "subject_name subject_code")
    .sort({ day_of_week: 1, start_time: 1 });
};

const updateSchedule = async (scheduleId, updateData) => {
  const schedule = await ClassSubjectSchedule.findById(scheduleId);
  if (!schedule) {
    throw new CustomError("Schedule not found", statusCode.NOT_FOUND);
  }

  if (updateData.section_id)
    updateData.section_id = new mongoose.Types.ObjectId(updateData.section_id);

  if (updateData.subject_id)
    updateData.subject_id = new mongoose.Types.ObjectId(updateData.subject_id);

  if (updateData.teacher_id)
    updateData.teacher_id = new mongoose.Types.ObjectId(updateData.teacher_id);

  // ✅ renamed field support
  if (updateData.room_number !== undefined) {
    schedule.room_number = updateData.room_number;
  }

  // ✅ academic year support
  if (updateData.academic_year !== undefined) {
    schedule.academic_year = updateData.academic_year;
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      schedule[key] = updateData[key];
    }
  });

  await schedule.save();

  return await ClassSubjectSchedule.findById(scheduleId)
    .populate("class_id", "class_name class_type academic_year class_teacher_id")
    .populate({
      path: "section_id",
      select: "section_name class_teacher_id",
      populate: {
        path: "class_teacher_id",
        select: "teacher_code full_name",
      },
    })
    .populate("subject_id", "subject_name subject_code")
    .populate("teacher_id", "full_name teacher_code");
};

const deleteSchedule = async (scheduleId) => {
  const schedule = await ClassSubjectSchedule.findById(scheduleId);
  if (!schedule) {
    throw new CustomError("Schedule not found", statusCode.NOT_FOUND);
  }

  await ClassSubjectSchedule.findByIdAndDelete(scheduleId);
  return schedule;
};

module.exports = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  getScheduleByClassId,
  getScheduleByTeacherId,
  updateSchedule,
  deleteSchedule,
};









































































// const ClassSubjectSchedule = require("../models/classSubjectSchedule.model");
// const mongoose = require("mongoose");

// const CustomError = require("../exceptions/CustomError");
// const statusCode = require("../enums/statusCode");

// const createSchedule = async (scheduleData) => {   
//   const schedule = new ClassSubjectSchedule({
//     class_id: new mongoose.Types.ObjectId(scheduleData.class_id),
//     section_id: scheduleData.section_id
//       ? new mongoose.Types.ObjectId(scheduleData.section_id)
//       : null,
//     subject_id: new mongoose.Types.ObjectId(scheduleData.subject_id),
//     teacher_id: scheduleData.teacher_id
//       ? new mongoose.Types.ObjectId(scheduleData.teacher_id)
//       : null,
//     day_of_week: scheduleData.day_of_week || null,
//     start_time: scheduleData.start_time,
//     end_time: scheduleData.end_time,
//     room_no: scheduleData.room_no || null,
//     status: "active",
//   });

//   await schedule.save();
//   return schedule;
// };

// const getAllSchedules = async (filters = {}) => {
//   const query = {};

//   if (filters.class_id) query.class_id = filters.class_id;
//   if (filters.section_id) query.section_id = filters.section_id;
//   if (filters.subject_id) query.subject_id = filters.subject_id;
//   if (filters.teacher_id) query.teacher_id = filters.teacher_id;
//   if (filters.day_of_week) query.day_of_week = filters.day_of_week;
//   if (filters.status) query.status = filters.status;

//   const schedules = await ClassSubjectSchedule.find(query)
//     .populate("class_id", "class_name class_type academic_year class_teacher_id")
//     // .populate("section_id", "section_name class_teacher_id")
//     .populate({
//     path: "section_id",
//     select: "section_name class_teacher_id",
//     populate: {
//       path: "class_teacher_id",
//       select: "teacher_code full_name"
//     }
//   })
//     .populate("subject_id", "subject_name subject_code")
//     .populate("teacher_id", "full_name teacher_code")
//     .sort({ day_of_week: 1, start_time: 1 });

//   return schedules;
// };

// const getScheduleById = async (scheduleId) => {
//   const schedule = await ClassSubjectSchedule.findById(scheduleId)
//     .populate("class_id", "class_name class_type academic_year class_teacher_id")
//     .populate({
//     path: "section_id",
//     select: "section_name class_teacher_id",
//     populate: {
//       path: "class_teacher_id",
//       select: "teacher_code full_name"
//     }
//   })
//     .populate("subject_id", "subject_name subject_code")
//     .populate("teacher_id", "full_name teacher_code");

//   if (!schedule) {
//     throw new CustomError("Schedule not found", statusCode.NOT_FOUND);
//   }

//   return schedule;
// };

// const getScheduleByClassId = async (classId, sectionId = null) => {
//   const query = { class_id: classId };
//   if (sectionId) {
//     query.section_id = sectionId;
//   }

//   const schedules = await ClassSubjectSchedule.find(query)
//     .populate({
//     path: "section_id",
//     select: "section_name class_teacher_id",
//     populate: {
//       path: "class_teacher_id",
//       select: "teacher_code full_name"
//     }
//   })
//     .populate("subject_id", "subject_name subject_code")
//     .populate("teacher_id", "full_name teacher_code")
//     .sort({ day_of_week: 1, start_time: 1 });

//   return schedules;   
// };

// const getScheduleByTeacherId = async (teacherId) => {
//   const schedules = await ClassSubjectSchedule.find({ teacher_id: teacherId })
//     .populate("class_id", "class_name class_type academic_year class_teacher_id")
//     .populate({
//     path: "section_id",
//     select: "section_name class_teacher_id", 
//     populate: {
//       path: "class_teacher_id",
//       select: "teacher_code full_name"
//     }
//   })
//     .populate("subject_id", "subject_name subject_code")
//     .sort({ day_of_week: 1, start_time: 1 });

//   return schedules;
// };

// const updateSchedule = async (scheduleId, updateData) => {
//   const schedule = await ClassSubjectSchedule.findById(scheduleId);

//   if (!schedule) {
//     throw new CustomError("Schedule not found", statusCode.NOT_FOUND);
//   }

//   // Convert IDs to ObjectId if provided
//   if (updateData.section_id) {
//     updateData.section_id = new mongoose.Types.ObjectId(updateData.section_id);
//   }
//   if (updateData.subject_id) {
//     updateData.subject_id = new mongoose.Types.ObjectId(updateData.subject_id);
//   }
//   if (updateData.teacher_id) {
//     updateData.teacher_id = new mongoose.Types.ObjectId(updateData.teacher_id);
//   }

//   Object.keys(updateData).forEach((key) => {
//     if (updateData[key] !== undefined) {
//       schedule[key] = updateData[key];
//     }
//   });

//   await schedule.save();
//   return await ClassSubjectSchedule.findById(scheduleId)
//     .populate("class_id", "class_name class_type academic_year class_teacher_id ") 
//     .populate({
//     path: "section_id",
//     select: "section_name class_teacher_id",
//     populate: {
//       path: "class_teacher_id",
//       select: "teacher_code full_name"
//     }
//   })
//     .populate("subject_id", "subject_name subject_code")
//     .populate("teacher_id", "full_name teacher_code");
// };

// const deleteSchedule = async (scheduleId) => {
//   const schedule = await ClassSubjectSchedule.findById(scheduleId);

//   if (!schedule) {
//     throw new CustomError("Schedule not found", statusCode.NOT_FOUND);
//   }

//   await ClassSubjectSchedule.findByIdAndDelete(scheduleId);
//   return schedule;
// };
 
// module.exports = {
//   createSchedule,
//   getAllSchedules,
//   getScheduleById,
//   getScheduleByClassId,
//   getScheduleByTeacherId,
//   updateSchedule,
//   deleteSchedule,
// };