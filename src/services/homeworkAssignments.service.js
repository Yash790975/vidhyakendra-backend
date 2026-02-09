const HomeworkAssignments = require("../models/homeworkAssignments.model");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode"); 

const createHomeworkAssignment = async (assignmentData, files = []) => {
  const attachment_urls = files.length > 0
    ? files.map(file => `/uploads/homework_assignments/${file.filename}`)
    : null;

  const assignment = new HomeworkAssignments({
    institute_id: new mongoose.Types.ObjectId(assignmentData.institute_id),
    title: assignmentData.title,
    description: assignmentData.description || null,
    subject_id: new mongoose.Types.ObjectId(assignmentData.subject_id),
    class_id: new mongoose.Types.ObjectId(assignmentData.class_id),
    section_id: assignmentData.section_id
      ? new mongoose.Types.ObjectId(assignmentData.section_id)
      : null,
    batch_id: assignmentData.batch_id
      ? new mongoose.Types.ObjectId(assignmentData.batch_id)
      : null,
    assigned_by: new mongoose.Types.ObjectId(assignmentData.assigned_by),
    assigned_date: assignmentData.assigned_date,
    due_date: assignmentData.due_date,
    total_marks: assignmentData.total_marks || null,
    attachment_urls: attachment_urls,
    instructions: assignmentData.instructions || null,
    priority: assignmentData.priority || null,
    status: assignmentData.status || "active",
  });

  await assignment.save();
  return assignment;
};

const getAllHomeworkAssignments = async (filters = {}) => {
  const query = {};

  if (filters.institute_id) query.institute_id = filters.institute_id;
  if (filters.class_id) query.class_id = filters.class_id;
  if (filters.section_id) query.section_id = filters.section_id;
  if (filters.batch_id) query.batch_id = filters.batch_id;
  if (filters.subject_id) query.subject_id = filters.subject_id;
  if (filters.assigned_by) query.assigned_by = filters.assigned_by;
  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;

  const assignments = await HomeworkAssignments.find(query)
    .populate("institute_id", "institute_name institute_code")
    .populate("subject_id", "subject_name")
    .populate("class_id", "class_name")
    .populate("section_id", "section_name")
    .populate("batch_id", "batch_name")
    .populate("assigned_by", "full_name teacher_code")
    .sort({ due_date: -1, createdAt: -1 });

  return assignments;
};

const getHomeworkAssignmentById = async (assignmentId) => {
  const assignment = await HomeworkAssignments.findById(assignmentId)
    .populate("institute_id", "institute_name institute_code")
    .populate("subject_id", "subject_name")
    .populate("class_id", "class_name")
    .populate("section_id", "section_name")
    .populate("batch_id", "batch_name")
    .populate("assigned_by", "full_name teacher_code");

  if (!assignment) {
    throw new CustomError("Homework assignment not found", statusCode.NOT_FOUND);
  }

  return assignment;
};

const updateHomeworkAssignment = async (assignmentId, updateData, newFiles = []) => {
  const assignment = await HomeworkAssignments.findById(assignmentId);

  if (!assignment) {
    throw new CustomError("Homework assignment not found", statusCode.NOT_FOUND);
  }

  // Handle new file uploads - add to existing files
  if (newFiles.length > 0) {
    const newUrls = newFiles.map(file => `/uploads/homework_assignments/${file.filename}`);
    assignment.attachment_urls = assignment.attachment_urls
      ? [...assignment.attachment_urls, ...newUrls]
      : newUrls;
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined && key !== "attachment_urls") {
      assignment[key] = updateData[key];
    }
  });

  await assignment.save();
  return await HomeworkAssignments.findById(assignmentId)
    .populate("institute_id", "institute_name institute_code")
    .populate("subject_id", "subject_name")
    .populate("class_id", "class_name")
    .populate("section_id", "section_name")
    .populate("batch_id", "batch_name")
    .populate("assigned_by", "full_name teacher_code");
};

const deleteHomeworkAssignment = async (assignmentId) => {
  const assignment = await HomeworkAssignments.findById(assignmentId);

  if (!assignment) {
    throw new CustomError("Homework assignment not found", statusCode.NOT_FOUND);
  }

  // Delete all attachment files
  if (assignment.attachment_urls && assignment.attachment_urls.length > 0) {
    assignment.attachment_urls.forEach((url) => {
      const filePath = path.join(
        require("../middlewares/upload").UPLOADS_ROOT,
        "homework_assignments",
        path.basename(url)
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  }

  await HomeworkAssignments.findByIdAndDelete(assignmentId);
  return { message: "Homework assignment deleted successfully" };
};

const deleteAttachment = async (assignmentId, attachmentUrl) => {
  const assignment = await HomeworkAssignments.findById(assignmentId);

  if (!assignment) {
    throw new CustomError("Homework assignment not found", statusCode.NOT_FOUND);
  }

  if (!assignment.attachment_urls || !assignment.attachment_urls.includes(attachmentUrl)) {
    throw new CustomError("Attachment not found", statusCode.NOT_FOUND);
  }

  // Remove from array
  assignment.attachment_urls = assignment.attachment_urls.filter(
    (url) => url !== attachmentUrl
  );

  // Delete file
  const filePath = path.join(
    require("../middlewares/upload").UPLOADS_ROOT,
    "homework_assignments",
    path.basename(attachmentUrl)
  );
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await assignment.save();
  return assignment;
};

// Get homework assignments for a specific class
const getHomeworkByClass = async (classId, sectionId = null, batchId = null) => {
  const query = {
    class_id: classId,
    status: "active",
  };

  if (sectionId) query.section_id = sectionId;
  if (batchId) query.batch_id = batchId;

  const assignments = await HomeworkAssignments.find(query)
    .populate("subject_id", "subject_name")
    .populate("assigned_by", "full_name")
    .sort({ due_date: 1 });

  return assignments;
};

module.exports = {
  createHomeworkAssignment,
  getAllHomeworkAssignments,
  getHomeworkAssignmentById,
  updateHomeworkAssignment,
  deleteHomeworkAssignment,
  deleteAttachment,
  getHomeworkByClass,
};
