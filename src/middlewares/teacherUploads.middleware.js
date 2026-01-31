// src/middleware/teacherUploads.middleware.js

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
const generateUniqueFilename = (teacherName, documentType, originalName) => {
  const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
  const ext = path.extname(originalName).toLowerCase();
  const cleanName = teacherName.toLowerCase().replace(/[^a-z0-9]/g, "_");
  const cleanType = documentType.toLowerCase().replace(/[^a-z0-9]/g, "_");
  return `${cleanName}_${cleanType}_${randomNum}${ext}`;
};

// ========== IDENTITY DOCUMENTS UPLOAD ==========

const identityDocStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(UPLOADS_ROOT, "teacher_identity_documents");
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const teacherName = req.body.teacher_name || "teacher";
    const documentType = req.body.document_type || "document";
    const filename = generateUniqueFilename(teacherName, documentType, file.originalname);
    cb(null, filename);
  },
});

const identityDocFilter = (req, file, cb) => {
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

const uploadIdentityDocument = multer({
  storage: identityDocStorage,
  fileFilter: identityDocFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// ========== QUALIFICATION DOCUMENTS UPLOAD ==========

const qualificationStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(UPLOADS_ROOT, "teacher_qualifications");
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const teacherName = req.body.teacher_name || "teacher";
    const qualification = req.body.qualification || "qualification";
    const filename = generateUniqueFilename(teacherName, qualification, file.originalname);
    cb(null, filename);
  },
});

const qualificationFilter = (req, file, cb) => {
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

const uploadQualificationDocument = multer({
  storage: qualificationStorage,
  fileFilter: qualificationFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

module.exports = {
  uploadIdentityDocument,
  uploadQualificationDocument,
};