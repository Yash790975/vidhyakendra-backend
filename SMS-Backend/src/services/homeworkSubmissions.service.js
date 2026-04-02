const HomeworkSubmissions = require("../models/homeworkSubmissions.model");
const HomeworkAssignments = require("../models/homeworkAssignments.model");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");

const createHomeworkSubmission = async (submissionData, files = []) => {
  // Check if homework assignment exists
  const homework = await HomeworkAssignments.findById(submissionData.homework_id);
  if (!homework) {
    throw new CustomError("Homework assignment not found", statusCode.NOT_FOUND);
  }

  // Check if student already submitted
  const existing = await HomeworkSubmissions.findOne({
    homework_id: submissionData.homework_id,
    student_id: submissionData.student_id,
  });

  if (existing) {
    throw new CustomError(
      "Student has already submitted this homework",
      statusCode.CONFLICT
    );
  }

  const attachment_urls = files.length > 0
    ? files.map(file => `/uploads/homework_submissions/${file.filename}`)
    : null;

  // Check if submission is late
  const submissionDate = new Date();
  const isLate = submissionDate > new Date(homework.due_date);

  const submission = new HomeworkSubmissions({
    homework_id: new mongoose.Types.ObjectId(submissionData.homework_id),
    student_id: new mongoose.Types.ObjectId(submissionData.student_id),
    submission_date: submissionDate,
    submission_text: submissionData.submission_text || null,
    attachment_urls: attachment_urls,
    status: isLate ? "late_submission" : "submitted",
    is_late: isLate,
  });

  await submission.save();
  return submission;
};

const getAllHomeworkSubmissions = async (filters = {}) => {
  const query = {};

  if (filters.homework_id) query.homework_id = filters.homework_id;
  if (filters.student_id) query.student_id = filters.student_id;
  if (filters.status) query.status = filters.status;
  if (filters.is_late !== undefined) query.is_late = filters.is_late;

  const submissions = await HomeworkSubmissions.find(query)
    .populate({
      path: "homework_id",
      populate: [
        { path: "institute_id", select: "institute_name institute_code"},
        { path: "subject_id", select: "subject_name" },
        { path: "class_id", select: "class_name" },
        { path: "assigned_by", select: "full_name" },
      ],
    })
    .populate("student_id", "full_name student_code")
    .populate("evaluated_by", "full_name")
    .sort({ createdAt: -1 });

  return submissions;
};

const getHomeworkSubmissionById = async (submissionId) => {
  const submission = await HomeworkSubmissions.findById(submissionId)
    .populate({
      path: "homework_id",
      populate: [
        
        { path: "institute_id", select: "institute_name institute_code"},
        { path: "subject_id", select: "subject_name" },
        { path: "class_id", select: "class_name" },
        { path: "assigned_by", select: "full_name" },
      ],
    })
    .populate("student_id", "full_name student_code")
    .populate("evaluated_by", "full_name");

  if (!submission) {
    throw new CustomError("Homework submission not found", statusCode.NOT_FOUND);
  }

  return submission;
};

const updateHomeworkSubmission = async (submissionId, updateData, newFiles = []) => {
  const submission = await HomeworkSubmissions.findById(submissionId);

  if (!submission) {
    throw new CustomError("Homework submission not found", statusCode.NOT_FOUND);
  }

  // Handle new file uploads - add to existing files
  if (newFiles.length > 0) {
    const newUrls = newFiles.map(file => `/uploads/homework_submissions/${file.filename}`);
    submission.attachment_urls = submission.attachment_urls
      ? [...submission.attachment_urls, ...newUrls]
      : newUrls;
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined && key !== "attachment_urls") {
      submission[key] = updateData[key];
    }
  });

  await submission.save();
  return await HomeworkSubmissions.findById(submissionId)
    .populate({
      path: "homework_id",
      populate: [
        { path: "institute_id", select: "institute_name institute_code"},
        { path: "subject_id", select: "subject_name" },
        { path: "class_id", select: "class_name" },
      ],
    })
    .populate("student_id", "full_name student_code")
    .populate("evaluated_by", "full_name");
};

const evaluateHomeworkSubmission = async (submissionId, evaluationData) => {
  const submission = await HomeworkSubmissions.findById(submissionId);

  if (!submission) {
    throw new CustomError("Homework submission not found", statusCode.NOT_FOUND);
  }

  submission.marks_obtained = evaluationData.marks_obtained;
  submission.feedback = evaluationData.feedback || null;
  submission.evaluated_by = new mongoose.Types.ObjectId(evaluationData.evaluated_by);
  submission.evaluated_at = new Date();
  submission.status = "evaluated";

  await submission.save();
  return await HomeworkSubmissions.findById(submissionId)
    .populate({
      path: "homework_id",
      populate: [
        { path: "institute_id", select: "institute_name institute_code"},
        { path: "subject_id", select: "subject_name" },
        { path: "class_id", select: "class_name" },
      ],
    })
    .populate("student_id", "full_name student_code")
    .populate("evaluated_by", "full_name");
};

const deleteHomeworkSubmission = async (submissionId) => {
  const submission = await HomeworkSubmissions.findById(submissionId);

  if (!submission) {
    throw new CustomError("Homework submission not found", statusCode.NOT_FOUND);
  }

  // Delete all attachment files
  if (submission.attachment_urls && submission.attachment_urls.length > 0) {
    submission.attachment_urls.forEach((url) => {
      const filePath = path.join(
        require("../middlewares/upload").UPLOADS_ROOT,
        "homework_submissions",
        path.basename(url)
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  }

  await HomeworkSubmissions.findByIdAndDelete(submissionId);
  return { message: "Homework submission deleted successfully" };
};

const deleteAttachment = async (submissionId, attachmentUrl) => {
  const submission = await HomeworkSubmissions.findById(submissionId);

  if (!submission) {
    throw new CustomError("Homework submission not found", statusCode.NOT_FOUND);
  }

  if (!submission.attachment_urls || !submission.attachment_urls.includes(attachmentUrl)) {
    throw new CustomError("Attachment not found", statusCode.NOT_FOUND);
  }

  // Remove from array
  submission.attachment_urls = submission.attachment_urls.filter(
    (url) => url !== attachmentUrl
  );

  // Delete file
  const filePath = path.join(
    require("../middlewares/upload").UPLOADS_ROOT,
    "homework_submissions",
    path.basename(attachmentUrl)
  );
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await submission.save();
  return submission;
};

module.exports = {
  createHomeworkSubmission,
  getAllHomeworkSubmissions,
  getHomeworkSubmissionById,
  updateHomeworkSubmission,
  evaluateHomeworkSubmission,
  deleteHomeworkSubmission,
  deleteAttachment,
};
