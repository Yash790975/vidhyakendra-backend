const ExamSchedules = require("../models/examSchedules.model");
const ExamsMaster = require("../models/examsMaster.model");
const mongoose = require("mongoose");

const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");

const createExamSchedule = async (scheduleData) => {
  // Verify exam exists
  const exam = await ExamsMaster.findById(scheduleData.exam_id);
  if (!exam) {
    throw new CustomError("Exam not found", statusCode.NOT_FOUND);
  }

  const examDate = scheduleData.exam_date;
  const startTime = scheduleData.start_time;
  const endTime = scheduleData.end_time;

  // -------------------------------
  // ✅ Common overlap condition
  // -------------------------------
  const timeOverlapCondition = {
    exam_date: examDate,
    start_time: { $lt: endTime },
    end_time: { $gt: startTime },
  };

  // =====================================================
  // ✅ 1. Prevent double schedule for same invigilator
  // =====================================================
  if (scheduleData.invigilator_id && startTime && endTime) {
    const teacherConflict = await ExamSchedules.findOne({
      invigilator_id: scheduleData.invigilator_id,
      ...timeOverlapCondition,
    });

    if (teacherConflict) {
      throw new CustomError(
        "This teacher already has an exam scheduled at the same date and time",
        statusCode.CONFLICT
      );
    }
  }

  // =====================================================
  // ✅ 2. Prevent double schedule for same class/section
  // =====================================================
  if (scheduleData.class_id && startTime && endTime) {
    const classSectionConflict = await ExamSchedules.findOne({
      class_id: scheduleData.class_id,
      section_id: scheduleData.section_id || null,
      ...timeOverlapCondition,
    });

    if (classSectionConflict) {
      throw new CustomError(
        "This class/section already has an exam scheduled at the same date and time",
        statusCode.CONFLICT
      );
    }
  }

  // -------------------------------
  // ✅ Create Schedule
  // -------------------------------
  const schedule = new ExamSchedules({
    exam_id: new mongoose.Types.ObjectId(scheduleData.exam_id),
    class_id: new mongoose.Types.ObjectId(scheduleData.class_id),
    section_id: scheduleData.section_id
      ? new mongoose.Types.ObjectId(scheduleData.section_id)
      : null,
    batch_id: scheduleData.batch_id
      ? new mongoose.Types.ObjectId(scheduleData.batch_id)
      : null,
    subject_id: new mongoose.Types.ObjectId(scheduleData.subject_id),
    exam_date: examDate,
    start_time: startTime || null,
    end_time: endTime || null,
    duration_minutes: scheduleData.duration_minutes || null,
    room_number: scheduleData.room_number || null,
    total_marks: scheduleData.total_marks,
    pass_marks: scheduleData.pass_marks || null,
    theory_marks: scheduleData.theory_marks || null,
    practical_marks: scheduleData.practical_marks || null,
    invigilator_id: scheduleData.invigilator_id
      ? new mongoose.Types.ObjectId(scheduleData.invigilator_id)
      : null,
    status: scheduleData.status || "scheduled",
  });

  await schedule.save();
  return schedule;
};


const getAllExamSchedules = async (filters = {}) => {
  const query = {};

  if (filters.exam_id) query.exam_id = filters.exam_id;
  if (filters.class_id) query.class_id = filters.class_id;
  if (filters.section_id) query.section_id = filters.section_id;
  if (filters.batch_id) query.batch_id = filters.batch_id;
  if (filters.subject_id) query.subject_id = filters.subject_id;
  if (filters.status) query.status = filters.status;

  const schedules = await ExamSchedules.find(query)
    .populate({
      path: "exam_id",
      select: "exam_name exam_code exam_type academic_year",
      populate: {
        path: "institute_id",
        select: "institute_name",
      },
    })
    .populate("class_id", "class_name")
    .populate("section_id", "section_name")
    .populate("batch_id", "batch_name")
    .populate("subject_id", "subject_name")
    .populate("invigilator_id", "full_name teacher_code")
    .sort({ exam_date: 1, start_time: 1 });

  return schedules;
};

const getExamScheduleById = async (scheduleId) => {
  const schedule = await ExamSchedules.findById(scheduleId)
    .populate({
      path: "exam_id",
      select: "exam_name exam_code exam_type academic_year",
      populate: {
        path: "institute_id",
        select: "institute_name",
      },
    })
    .populate("class_id", "class_name")
    .populate("section_id", "section_name")
    .populate("batch_id", "batch_name")
    .populate("subject_id", "subject_name")
    .populate("invigilator_id", "full_name teacher_code");

  if (!schedule) {
    throw new CustomError("Exam schedule not found", statusCode.NOT_FOUND);
  }

  return schedule;
};

const getExamSchedulesByExamId = async (examId) => {
  const schedules = await ExamSchedules.find({ exam_id: examId })
    .populate("class_id", "class_name")
    .populate("section_id", "section_name")
    .populate("batch_id", "batch_name")
    .populate("subject_id", "subject_name")
    .populate("invigilator_id", "full_name teacher_code")
    .sort({ exam_date: 1, start_time: 1 });

  return schedules;
};

const updateExamSchedule = async (scheduleId, updateData) => {
  const schedule = await ExamSchedules.findById(scheduleId);

  if (!schedule) {
    throw new CustomError("Exam schedule not found", statusCode.NOT_FOUND);
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      schedule[key] = updateData[key];
    }
  });

  await schedule.save();
  return await ExamSchedules.findById(scheduleId)
    .populate({
      path: "exam_id",
      select: "exam_name exam_code exam_type academic_year",
    })
    .populate("class_id", "class_name")
    .populate("section_id", "section_name")
    .populate("batch_id", "batch_name")
    .populate("subject_id", "subject_name")
    .populate("invigilator_id", "full_name teacher_code");
};

const deleteExamSchedule = async (scheduleId) => {
  const schedule = await ExamSchedules.findById(scheduleId);

  if (!schedule) {
    throw new CustomError("Exam schedule not found", statusCode.NOT_FOUND);
  }

  await ExamSchedules.findByIdAndDelete(scheduleId);
  return { message: "Exam schedule deleted successfully" };
};

module.exports = {
  createExamSchedule,
  getAllExamSchedules,
  getExamScheduleById,
  getExamSchedulesByExamId,
  updateExamSchedule,
  deleteExamSchedule,
};
