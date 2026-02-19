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
const generateUniqueFilename = (studentName, documentType, originalName) => {
  const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
  const ext = path.extname(originalName).toLowerCase();
  const cleanName = studentName.toLowerCase().replace(/[^a-z0-9]/g, "_");
  const cleanType = documentType.toLowerCase().replace(/[^a-z0-9]/g, "_");
  return `${cleanName}_${cleanType}_${randomNum}${ext}`;
};

// ========== STUDENT IDENTITY DOCUMENTS UPLOAD ==========

const studentIdentityDocStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(UPLOADS_ROOT, "student_identity_documents");
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const studentName = req.body.student_name || "student";
    const documentType = req.body.document_type || "document";
    const filename = generateUniqueFilename(studentName, documentType, file.originalname);
    cb(null, filename);
  },
});

const studentIdentityDocFilter = (req, file, cb) => {
  const allowedExt = [".jpg", ".jpeg", ".png", ".pdf", ".webp", ".gif"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExt.includes(ext)) {
    return cb(
      new Error("Only .jpg, .jpeg, .png, .pdf, .webp, and .gif formats are allowed!"),
      false
    );
  }
  cb(null, true);
};

const uploadStudentIdentityDocument = multer({
  storage: studentIdentityDocStorage,
  fileFilter: studentIdentityDocFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// ========== STUDENT ACADEMIC DOCUMENTS UPLOAD ==========

const studentAcademicDocStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(UPLOADS_ROOT, "student_academic_documents");
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const studentName = req.body.student_name || "student";
    const documentType = req.body.document_type || "document";
    const filename = generateUniqueFilename(studentName, documentType, file.originalname);
    cb(null, filename);
  },
});

const studentAcademicDocFilter = (req, file, cb) => {
  const allowedExt = [".jpg", ".jpeg", ".png", ".pdf", ".webp", ".gif"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExt.includes(ext)) {
    return cb(
      new Error("Only .jpg, .jpeg, .png, .pdf, .webp, and .gif formats are allowed!"),
      false
    );
  }
  cb(null, true);
};

const uploadStudentAcademicDocument = multer({
  storage: studentAcademicDocStorage,
  fileFilter: studentAcademicDocFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

module.exports = {
  uploadStudentIdentityDocument,
  uploadStudentAcademicDocument,
};
