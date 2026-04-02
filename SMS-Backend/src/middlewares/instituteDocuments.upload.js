

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
const generateUniqueFilename = (instituteName, documentType, originalName) => {
  const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
  const ext = path.extname(originalName).toLowerCase();
  const cleanName = instituteName.toLowerCase().replace(/[^a-z0-9]/g, "_");
  const cleanType = documentType.toLowerCase().replace(/[^a-z0-9]/g, "_");
  return `${cleanName}_${cleanType}_${randomNum}${ext}`;
};

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // const uploadPath = path.join(UPLOADS_ROOT, "instituteDocuments");
    const uploadPath = path.join(UPLOADS_ROOT, "institute_documents");
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const instituteName = req.body.institute_name || "institute";
    const documentType = req.body.document_type || "document";
    const filename = generateUniqueFilename(
      instituteName,
      documentType,
      file.originalname
    );
    cb(null, filename);
  },
});

// File filter for documents (images and PDFs)
const fileFilter = (req, file, cb) => {
  const allowedExt = [".jpg", ".jpeg", ".png", ".pdf", ".webp", ".gif"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExt.includes(ext)) {
    return cb(
      new Error(
        "Only .jpg, .jpeg, .png, .pdf, .webp, and .gif formats are allowed!"
      ),
      false
    );
  }
  cb(null, true);
};

// Multer upload configuration
const uploadDocument = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

module.exports = {
  uploadDocument,
};