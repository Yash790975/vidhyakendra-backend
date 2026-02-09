const ExamsMaster = require("../models/examsMaster.model");
const mongoose = require("mongoose");

const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");

const createExam = async (examData) => {
  const createdByModel =
    examData.created_by_role === "institute_admin"
      ? "institute_admins"
      : "TeachersMaster";

  const exam = new ExamsMaster({
    institute_id: new mongoose.Types.ObjectId(examData.institute_id),
    exam_name: examData.exam_name,
    exam_code: examData.exam_code || null,
    exam_type: examData.exam_type,
    academic_year: examData.academic_year,
    term: examData.term || null,
    start_date: examData.start_date || null,
    end_date: examData.end_date || null,
    description: examData.description || null,
    instructions: examData.instructions || null,
    status: examData.status || "draft",
    created_by: examData.created_by
      ? new mongoose.Types.ObjectId(examData.created_by)
      : null,
    created_by_model: examData.created_by ? createdByModel : null,
  });

  await exam.save();
  return exam;
};

const getAllExams = async (filters = {}) => {
  const query = {};

  if (filters.institute_id) query.institute_id = filters.institute_id;
  if (filters.exam_type) query.exam_type = filters.exam_type;
  if (filters.academic_year) query.academic_year = filters.academic_year;
  if (filters.status) query.status = filters.status;

  const exams = await ExamsMaster.find(query)
    .populate("institute_id", "institute_name institute_code")
    .populate("created_by")
    .sort({ start_date: -1, createdAt: -1 });

  return exams;
};

const getExamById = async (examId) => {
  const exam = await ExamsMaster.findById(examId)
    .populate("institute_id", "institute_name institute_code")
    .populate("created_by");

  if (!exam) {
    throw new CustomError("Exam not found", statusCode.NOT_FOUND);
  }

  return exam;
};

const updateExam = async (examId, updateData) => {
  const exam = await ExamsMaster.findById(examId);

  if (!exam) {
    throw new CustomError("Exam not found", statusCode.NOT_FOUND);
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      exam[key] = updateData[key];
    }
  });

  await exam.save();
  return await ExamsMaster.findById(examId)
    .populate("institute_id", "institute_name institute_code")
    .populate("created_by");
};

const deleteExam = async (examId) => {
  const exam = await ExamsMaster.findById(examId);

  if (!exam) {
    throw new CustomError("Exam not found", statusCode.NOT_FOUND);
  }

  await ExamsMaster.findByIdAndDelete(examId);
  return { message: "Exam deleted successfully" };
};

module.exports = {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
};
