const Assessments = require("../models/assessments.model");
const AssessmentQuestions = require("../models/assessmentQuestions.model");
const AssessmentAttempts = require("../models/assessmentAttempts.model");
const AssessmentAnswers = require("../models/assessmentAnswers.model");
const mongoose = require("mongoose");

const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");
const { formatAssessmentDates } = require("../utils/dateFormatter");

const formatAssessment = (doc) => {
  const obj = doc.toObject();
  return formatAssessmentDates(obj);
};

// Shared populate helper
const populateAssessment = (query) =>
  query
    .populate("institute_id", "institute_name institute_code")
    .populate("class_id", "class_name")
    .populate("section_id", "section_name")
    .populate("batch_id", "batch_name start_time end_time")
    .populate("subject_id", "subject_name subject_code")
    .populate("created_by", "full_name teacher_code");

const createAssessment = async (assessmentData) => {
  const isCoaching = assessmentData.institute_type === "coaching";

  const assessment = new Assessments({
    institute_id: new mongoose.Types.ObjectId(assessmentData.institute_id),
    institute_type: assessmentData.institute_type,
    title: assessmentData.title,
    description: assessmentData.description || null,
    assessment_type: assessmentData.assessment_type,

    //  Coaching: batch_id required, class_id/section_id forced null
    //  School: class_id required, batch_id forced null
    class_id: isCoaching
      ? null
      : new mongoose.Types.ObjectId(assessmentData.class_id),
    section_id: isCoaching
      ? null
      : assessmentData.section_id
        ? new mongoose.Types.ObjectId(assessmentData.section_id)
        : null,
    batch_id: isCoaching
      ? new mongoose.Types.ObjectId(assessmentData.batch_id)
      : null,

    subject_id: new mongoose.Types.ObjectId(assessmentData.subject_id),
    academic_year: assessmentData.academic_year,
    total_marks: assessmentData.total_marks || null,
    pass_marks: assessmentData.pass_marks || null,
    duration_minutes: assessmentData.duration_minutes || null,
    available_from: assessmentData.available_from || null,
    available_until: assessmentData.available_until || null,
    max_attempts: assessmentData.max_attempts || null,
    show_result_immediately: assessmentData.show_result_immediately ?? null,
    show_answer_key: assessmentData.show_answer_key ?? null,
    status: assessmentData.status || "draft",
    created_by: new mongoose.Types.ObjectId(assessmentData.created_by),
  });

  await assessment.save();
  return formatAssessment(assessment);
};

const getAllAssessments = async (filters = {}) => {
  const query = {};

  if (filters.institute_id)
    query.institute_id = new mongoose.Types.ObjectId(filters.institute_id);
  if (filters.institute_type)                                
    query.institute_type = filters.institute_type;
  if (filters.class_id)
    query.class_id = new mongoose.Types.ObjectId(filters.class_id);
  if (filters.section_id)
    query.section_id = new mongoose.Types.ObjectId(filters.section_id);
  if (filters.batch_id)
    query.batch_id = new mongoose.Types.ObjectId(filters.batch_id);
  if (filters.subject_id)
    query.subject_id = new mongoose.Types.ObjectId(filters.subject_id);
  if (filters.created_by)
    query.created_by = new mongoose.Types.ObjectId(filters.created_by);
  if (filters.status) query.status = filters.status;
  if (filters.assessment_type) query.assessment_type = filters.assessment_type;
  if (filters.academic_year) query.academic_year = filters.academic_year;

  if (filters.available_now === "true") {
    const now = new Date();
    query.$or = [{ available_from: null }, { available_from: { $lte: now } }];
    query.$and = [
      { $or: [{ available_until: null }, { available_until: { $gte: now } }] },
    ];
  }

  const assessments = await populateAssessment(
    Assessments.find(query).sort({ createdAt: -1 })
  );

  return assessments.map(formatAssessment);
};

const getAssessmentById = async (assessmentId) => {
  const assessment = await populateAssessment(
    Assessments.findById(assessmentId)
  );

  if (!assessment) {
    throw new CustomError("Assessment not found", statusCode.NOT_FOUND);
  }

  return formatAssessment(assessment);
};

const updateAssessment = async (assessmentId, updateData) => {
  const assessment = await Assessments.findById(assessmentId);

  if (!assessment) {
    throw new CustomError("Assessment not found", statusCode.NOT_FOUND);
  }

  //  Enforce coaching rules on update too
  if (assessment.institute_type === "coaching") {
    if (updateData.class_id) updateData.class_id = null;
    if (updateData.section_id) updateData.section_id = null;
  }
  if (assessment.institute_type === "school") {
    if (updateData.batch_id) updateData.batch_id = null;
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) assessment[key] = updateData[key];
  });

  await assessment.save();

  const updated = await populateAssessment(Assessments.findById(assessmentId));
  return formatAssessment(updated);
};

const deleteAssessment = async (assessmentId) => {
  const assessment = await Assessments.findById(assessmentId);

  if (!assessment) {
    throw new CustomError("Assessment not found", statusCode.NOT_FOUND);
  }

  const attempts = await AssessmentAttempts.find({ assessment_id: assessmentId });
  const attemptIds = attempts.map((a) => a._id);

  await AssessmentAnswers.deleteMany({ attempt_id: { $in: attemptIds } });
  await AssessmentAttempts.deleteMany({ assessment_id: assessmentId });
  await AssessmentQuestions.deleteMany({ assessment_id: assessmentId });
  await Assessments.findByIdAndDelete(assessmentId);

  return { message: "Assessment and all related data deleted successfully" };
};

const getAssessmentAnalytics = async (assessmentId) => {
  const assessment = await Assessments.findById(assessmentId);

  if (!assessment) {
    throw new CustomError("Assessment not found", statusCode.NOT_FOUND);
  }

  const attempts = await AssessmentAttempts.find({
    assessment_id: assessmentId,
    status: { $in: ["submitted", "auto_submitted"] },
  });

  const totalAttempted = attempts.length;
  const passed = attempts.filter((a) => a.is_pass === true).length;
  const failed = attempts.filter((a) => a.is_pass === false).length;
  const totalMarksObtained = attempts.reduce(
    (sum, a) => sum + (parseFloat(a.marks_obtained) || 0),
    0
  );
  const averageScore =
    totalAttempted > 0
      ? (totalMarksObtained / totalAttempted).toFixed(2)
      : 0;

  return {
    assessment_id: assessmentId,
    institute_type: assessment.institute_type,
    title: assessment.title,
    total_marks: assessment.total_marks,
    pass_marks: assessment.pass_marks,
    total_attempted: totalAttempted,
    passed,
    failed,
    average_score: parseFloat(averageScore),
  };
};

module.exports = {
  createAssessment,
  getAllAssessments,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  getAssessmentAnalytics,
};

















































































// const Assessments = require("../models/assessments.model");
// const AssessmentQuestions = require("../models/assessmentQuestions.model");
// const AssessmentAttempts = require("../models/assessmentAttempts.model");
// const AssessmentAnswers = require("../models/assessmentAnswers.model");
// const mongoose = require("mongoose");
     
// const CustomError = require("../exceptions/CustomError");
// const statusCode = require("../enums/statusCode");
// const { formatAssessmentDates } = require("../utils/dateFormatter");

// // Helper: format a single assessment document
// const formatAssessment = (doc) => {
//   const obj = doc.toObject();
//   return formatAssessmentDates(obj);
// };

// const createAssessment = async (assessmentData) => {
//   const assessment = new Assessments({
//     institute_id: new mongoose.Types.ObjectId(assessmentData.institute_id),
//     title: assessmentData.title,
//     description: assessmentData.description || null,
//     assessment_type: assessmentData.assessment_type,
//     class_id: new mongoose.Types.ObjectId(assessmentData.class_id),
//     section_id: assessmentData.section_id
//       ? new mongoose.Types.ObjectId(assessmentData.section_id)
//       : null,
//     batch_id: assessmentData.batch_id
//       ? new mongoose.Types.ObjectId(assessmentData.batch_id)
//       : null,
//     subject_id: new mongoose.Types.ObjectId(assessmentData.subject_id),
//     academic_year: assessmentData.academic_year,
//     total_marks: assessmentData.total_marks || null,
//     pass_marks: assessmentData.pass_marks || null,
//     duration_minutes: assessmentData.duration_minutes || null,
//     available_from: assessmentData.available_from || null,
//     available_until: assessmentData.available_until || null,
//     max_attempts: assessmentData.max_attempts || null,
//     show_result_immediately: assessmentData.show_result_immediately ?? null,
//     show_answer_key: assessmentData.show_answer_key ?? null,
//     status: assessmentData.status || "draft",
//     created_by: new mongoose.Types.ObjectId(assessmentData.created_by),
//   });

//   await assessment.save();
//   return formatAssessment(assessment);
// };

// const getAllAssessments = async (filters = {}) => {
//   const query = {};

//   if (filters.institute_id) query.institute_id = new mongoose.Types.ObjectId(filters.institute_id);
//   if (filters.class_id) query.class_id = new mongoose.Types.ObjectId(filters.class_id);
//   if (filters.section_id) query.section_id = new mongoose.Types.ObjectId(filters.section_id);
//   if (filters.batch_id) query.batch_id = new mongoose.Types.ObjectId(filters.batch_id);
//   if (filters.subject_id) query.subject_id = new mongoose.Types.ObjectId(filters.subject_id);
//   if (filters.created_by) query.created_by = new mongoose.Types.ObjectId(filters.created_by);
//   if (filters.status) query.status = filters.status;
//   if (filters.assessment_type) query.assessment_type = filters.assessment_type;
//   if (filters.academic_year) query.academic_year = filters.academic_year;

//   if (filters.available_now === "true") {
//     const now = new Date();
//     query.$or = [{ available_from: null }, { available_from: { $lte: now } }];
//     query.$and = [
//       { $or: [{ available_until: null }, { available_until: { $gte: now } }] },
//     ];
//   }

//   const assessments = await Assessments.find(query)
//     .populate("institute_id", "institute_name institute_code")
//     .populate("class_id", "class_name")
//     .populate("section_id", "section_name")
//     .populate("batch_id", "batch_name")
//     .populate("subject_id", "subject_name subject_code")
//     .populate("created_by", "full_name teacher_code")
//     .sort({ createdAt: -1 });

//   return assessments.map(formatAssessment);
// };

// const getAssessmentById = async (assessmentId) => {
//   const assessment = await Assessments.findById(assessmentId)
//     .populate("institute_id", "institute_name institute_code")
//     .populate("class_id", "class_name")
//     .populate("section_id", "section_name")
//     .populate("batch_id", "batch_name")
//     .populate("subject_id", "subject_name subject_code")
//     .populate("created_by", "full_name teacher_code");

//   if (!assessment) {
//     throw new CustomError("Assessment not found", statusCode.NOT_FOUND);
//   }

//   return formatAssessment(assessment);
// };

// const updateAssessment = async (assessmentId, updateData) => {
//   const assessment = await Assessments.findById(assessmentId);

//   if (!assessment) {
//     throw new CustomError("Assessment not found", statusCode.NOT_FOUND);
//   }

//   Object.keys(updateData).forEach((key) => {
//     if (updateData[key] !== undefined) {
//       assessment[key] = updateData[key];
//     }
//   });

//   await assessment.save();
//   const updated = await Assessments.findById(assessmentId)
//     .populate("institute_id", "institute_name institute_code")
//     .populate("class_id", "class_name")
//     .populate("section_id", "section_name")
//     .populate("batch_id", "batch_name")
//     .populate("subject_id", "subject_name subject_code")
//     .populate("created_by", "full_name teacher_code");
//   return formatAssessment(updated);
// };

// const deleteAssessment = async (assessmentId) => {
//   const assessment = await Assessments.findById(assessmentId);

//   if (!assessment) {
//     throw new CustomError("Assessment not found", statusCode.NOT_FOUND);
//   }

//   // Cascade delete: questions → attempt answers → attempts → assessment
//   const attempts = await AssessmentAttempts.find({ assessment_id: assessmentId });
//   const attemptIds = attempts.map((a) => a._id);

//   await AssessmentAnswers.deleteMany({ attempt_id: { $in: attemptIds } });
//   await AssessmentAttempts.deleteMany({ assessment_id: assessmentId });
//   await AssessmentQuestions.deleteMany({ assessment_id: assessmentId });
//   await Assessments.findByIdAndDelete(assessmentId);

//   return { message: "Assessment and all related data deleted successfully" };
// };

// const getAssessmentAnalytics = async (assessmentId) => {
//   const assessment = await Assessments.findById(assessmentId);

//   if (!assessment) {
//     throw new CustomError("Assessment not found", statusCode.NOT_FOUND);
//   }

//   const attempts = await AssessmentAttempts.find({
//     assessment_id: assessmentId,
//     status: { $in: ["submitted", "auto_submitted"] },
//   });

//   const totalAttempted = attempts.length;
//   const passed = attempts.filter((a) => a.is_pass === true).length;
//   const failed = attempts.filter((a) => a.is_pass === false).length;

//   const totalMarksObtained = attempts.reduce((sum, a) => {
//     return sum + (parseFloat(a.marks_obtained) || 0);
//   }, 0);

//   const averageScore =
//     totalAttempted > 0
//       ? (totalMarksObtained / totalAttempted).toFixed(2)
//       : 0;

//   return {
//     assessment_id: assessmentId,
//     title: assessment.title,
//     total_marks: assessment.total_marks,
//     pass_marks: assessment.pass_marks,
//     total_attempted: totalAttempted,
//     passed,
//     failed,
//     average_score: parseFloat(averageScore),
//   };
// };

// module.exports = {
//   createAssessment,
//   getAllAssessments,
//   getAssessmentById,
//   updateAssessment,
//   deleteAssessment,
//   getAssessmentAnalytics,
// };

