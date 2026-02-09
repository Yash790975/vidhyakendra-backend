const StudentExamResults = require("../models/studentExamResults.model");
const ExamSchedules = require("../models/examSchedules.model");
const mongoose = require("mongoose");

const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");

const createStudentExamResult = async (resultData) => {
  // Verify exam schedule exists
  const examSchedule = await ExamSchedules.findById(resultData.exam_schedule_id);
  if (!examSchedule) {
    throw new CustomError("Exam schedule not found", statusCode.NOT_FOUND);
  }

  // Check if result already exists for this student and exam schedule
  const existing = await StudentExamResults.findOne({
    exam_schedule_id: resultData.exam_schedule_id,
    student_id: resultData.student_id,
  });

  if (existing) {
    throw new CustomError(
      "Result already exists for this student and exam",
      statusCode.CONFLICT
    );
  }

  const evaluatedByModel =
    resultData.evaluated_by_role === "institute_admin"
      ? "institute_admins"
      : "TeachersMaster";

  const result = new StudentExamResults({
    exam_schedule_id: new mongoose.Types.ObjectId(resultData.exam_schedule_id),
    student_id: new mongoose.Types.ObjectId(resultData.student_id),
    theory_marks_obtained: resultData.theory_marks_obtained || null,
    practical_marks_obtained: resultData.practical_marks_obtained || null,
    total_marks_obtained: resultData.total_marks_obtained || null,
    total_marks: resultData.total_marks || null,
    percentage: resultData.percentage || null,
    grade: resultData.grade || null,
    rank: resultData.rank || null,
    remarks: resultData.remarks || null,
    is_absent: resultData.is_absent || null,
    is_pass: resultData.is_pass || null,
    evaluated_by: resultData.evaluated_by
      ? new mongoose.Types.ObjectId(resultData.evaluated_by)
      : null,
    evaluated_by_model: resultData.evaluated_by ? evaluatedByModel : null,
    evaluated_at: resultData.evaluated_by ? new Date() : null,
  });

  await result.save();
  return result;
};

const getAllStudentExamResults = async (filters = {}) => {
  const query = {};

  if (filters.exam_schedule_id) query.exam_schedule_id = filters.exam_schedule_id;
  if (filters.student_id) query.student_id = filters.student_id;
  if (filters.is_absent !== undefined) query.is_absent = filters.is_absent;
  if (filters.is_pass !== undefined) query.is_pass = filters.is_pass;

  const results = await StudentExamResults.find(query)
    .populate({
      path: "exam_schedule_id",
      populate: [
        {
          path: "exam_id",
          select: "exam_name exam_code exam_type academic_year",
        },
        {
          path: "subject_id",
          select: "subject_name",
        },
        {
          path: "class_id",
          select: "class_name",
        },
      ],
    })
    .populate("student_id", "full_name student_code")
    .populate("evaluated_by")
    .sort({ createdAt: -1 });

  return results;
};

const getStudentExamResultById = async (resultId) => {
  const result = await StudentExamResults.findById(resultId)
    .populate({
      path: "exam_schedule_id",
      populate: [
        {
          path: "exam_id",
          select: "exam_name exam_code exam_type academic_year",
        },
        {
          path: "subject_id",
          select: "subject_name",
        },
        {
          path: "class_id",
          select: "class_name",
        },
      ],
    })
    .populate("student_id", "full_name student_code")
    .populate("evaluated_by");

  if (!result) {
    throw new CustomError("Student exam result not found", statusCode.NOT_FOUND);
  }

  return result;
};

const getResultsByStudentId = async (studentId) => {
  const results = await StudentExamResults.find({ student_id: studentId })
    .populate({
      path: "exam_schedule_id",
      populate: [
        {
          path: "exam_id",
          select: "exam_name exam_code exam_type academic_year",
        },
        {
          path: "subject_id",
          select: "subject_name",
        },
      ],
    })
    .populate("evaluated_by", "full_name")
    .sort({ createdAt: -1 });

  return results;
};

const getResultsByExamSchedule = async (examScheduleId) => {
  const results = await StudentExamResults.find({ exam_schedule_id: examScheduleId })
    .populate("student_id", "full_name student_code")
    .populate("evaluated_by", "full_name")
    .sort({ total_marks_obtained: -1, rank: 1 });

  return results;
};

const updateStudentExamResult = async (resultId, updateData) => {
  const result = await StudentExamResults.findById(resultId);

  if (!result) {
    throw new CustomError("Student exam result not found", statusCode.NOT_FOUND);
  }

  // Handle evaluated_by update
  if (updateData.evaluated_by) {
    const evaluatedByModel =
      updateData.evaluated_by_role === "institute_admin"
        ? "institute_admins"
        : "TeachersMaster";
    result.evaluated_by_model = evaluatedByModel;
    result.evaluated_at = new Date();
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined && key !== "evaluated_by_role") {
      result[key] = updateData[key];
    }
  });

  await result.save();
  return await StudentExamResults.findById(resultId)
    .populate({
      path: "exam_schedule_id",
      populate: [
        {
          path: "exam_id",
          select: "exam_name exam_code exam_type academic_year",
        },
        {
          path: "subject_id",
          select: "subject_name",
        },
      ],
    })
    .populate("student_id", "full_name student_code")
    .populate("evaluated_by");
};

const deleteStudentExamResult = async (resultId) => {
  const result = await StudentExamResults.findById(resultId);

  if (!result) {
    throw new CustomError("Student exam result not found", statusCode.NOT_FOUND);
  }

  await StudentExamResults.findByIdAndDelete(resultId);
  return { message: "Student exam result deleted successfully" };
};

module.exports = {
  createStudentExamResult,
  getAllStudentExamResults,
  getStudentExamResultById,
  getResultsByStudentId,
  getResultsByExamSchedule,
  updateStudentExamResult,
  deleteStudentExamResult,
};
