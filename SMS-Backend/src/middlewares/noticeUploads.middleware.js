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
const generateUniqueFilename = (title, category, originalName) => {
  const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
  const ext = path.extname(originalName).toLowerCase();
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "_").substring(0, 30);
  const cleanCategory = category.toLowerCase().replace(/[^a-z0-9]/g, "_");
  return `${cleanTitle}_${cleanCategory}_${randomNum}${ext}`;
};

// ========== SUPER ADMIN NOTICES UPLOAD ==========

const superAdminNoticeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(UPLOADS_ROOT, "super_admin_notices");
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const title = req.body.title || "notice";
    const category = req.body.category || "general";
    const filename = generateUniqueFilename(title, category, file.originalname);
    cb(null, filename);
  },
});

const superAdminNoticeFilter = (req, file, cb) => {
  const allowedExt = [".jpg", ".jpeg", ".png", ".pdf", ".webp", ".gif", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExt.includes(ext)) {
    return cb(
      new Error("Only .jpg, .jpeg, .png, .pdf, .webp, .gif, .doc, and .docx formats are allowed!"),
      false
    );
  }
  cb(null, true);
};

const uploadSuperAdminNotice = multer({
  storage: superAdminNoticeStorage,
  fileFilter: superAdminNoticeFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// ========== INSTITUTE NOTICES UPLOAD ==========

const instituteNoticeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(UPLOADS_ROOT, "institute_notices");
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const title = req.body.title || "notice";
    const category = req.body.category || "general";
    const filename = generateUniqueFilename(title, category, file.originalname);
    cb(null, filename);
  },
});

const instituteNoticeFilter = (req, file, cb) => {
  const allowedExt = [".jpg", ".jpeg", ".png", ".pdf", ".webp", ".gif", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExt.includes(ext)) {
    return cb(
      new Error("Only .jpg, .jpeg, .png, .pdf, .webp, .gif, .doc, and .docx formats are allowed!"),
      false
    );
  }
  cb(null, true);
};

const uploadInstituteNotice = multer({
  storage: instituteNoticeStorage,
  fileFilter: instituteNoticeFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

module.exports = {
  uploadSuperAdminNotice,
  uploadInstituteNotice,
};
