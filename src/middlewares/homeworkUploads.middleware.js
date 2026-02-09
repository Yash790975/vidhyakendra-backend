const multer = require("multer");
const path = require("path");   
const fs = require("fs");
const { UPLOADS_ROOT } = require("./upload");

// Ensure directory exists
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Generate unique filename
const generateUniqueFilename = (title, type, originalName) => {
  const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
  const timestamp = Date.now();
  const ext = path.extname(originalName).toLowerCase();
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "_").substring(0, 20);
  const cleanType = type.toLowerCase().replace(/[^a-z0-9]/g, "_");
  return `${cleanTitle}_${cleanType}_${timestamp}_${randomNum}${ext}`;
};

// ========== HOMEWORK ASSIGNMENTS UPLOAD ==========

const homeworkAssignmentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(UPLOADS_ROOT, "homework_assignments");
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const title = req.body.title || "homework";
    const filename = generateUniqueFilename(title, "assignment", file.originalname);
    cb(null, filename);
  },
});

const homeworkAssignmentFilter = (req, file, cb) => {
  const allowedExt = [".jpg", ".jpeg", ".png", ".pdf", ".webp", ".gif", ".doc", ".docx", ".txt", ".ppt", ".pptx", ".xls", ".xlsx"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExt.includes(ext)) {
    return cb(
      new Error("Only .jpg, .jpeg, .png, .pdf, .webp, .gif, .doc, .docx, .txt, .ppt, .pptx, .xls, .xlsx formats are allowed!"),
      false
    );
  }
  cb(null, true);
};

const uploadHomeworkAssignment = multer({
  storage: homeworkAssignmentStorage,
  fileFilter: homeworkAssignmentFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
  },
});

// ========== HOMEWORK SUBMISSIONS UPLOAD ==========

const homeworkSubmissionStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(UPLOADS_ROOT, "homework_submissions");
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const studentId = req.body.student_id || "student";
    const filename = generateUniqueFilename(studentId, "submission", file.originalname);
    cb(null, filename);
  },
});

const homeworkSubmissionFilter = (req, file, cb) => {
  const allowedExt = [".jpg", ".jpeg", ".png", ".pdf", ".webp", ".gif", ".doc", ".docx", ".txt", ".ppt", ".pptx", ".xls", ".xlsx"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExt.includes(ext)) {
    return cb(
      new Error("Only .jpg, .jpeg, .png, .pdf, .webp, .gif, .doc, .docx, .txt, .ppt, .pptx, .xls, .xlsx formats are allowed!"),
      false
    );
  }
  cb(null, true);
};

const uploadHomeworkSubmission = multer({
  storage: homeworkSubmissionStorage,
  fileFilter: homeworkSubmissionFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
  },
});

module.exports = {
  uploadHomeworkAssignment,
  uploadHomeworkSubmission,
};
