const multer = require("multer");
const path = require("path"); 
const fs = require("fs");   

// Generate unique filename with random 6-digit number
const generateUniqueFilename = (originalName, prefix, index = null) => {
  const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
  const ext = path.extname(originalName).toLowerCase();
  const baseName = prefix.toLowerCase().replace(/[^a-z0-9]/g, "-");



  return `${baseName}_${randomNum}${ext}`;
};

// ✅ Custom image filter: only jpg, jpeg, png
const imageFilter = (req, file, cb) => {
  const allowedExt = [".jpg", ".jpeg", ".png","webp","gif"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExt.includes(ext)) {
    return cb(new Error("Only .jpg, .jpeg, .png  , webp, and , gif. image formats are allowed!"), false);
  }
  cb(null, true);
};

// ✅ Create folder if not exists
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};


// -------------------- Dynamic Root Path --------------------
// Root of project is where server.js is run
const PROJECT_ROOT = process.cwd();

// Upload folder outside project (same level)
const UPLOADS_ROOT = path.join(PROJECT_ROOT, "..", "uploads");// for local  for server use this
// //const UPLOADS_ROOT = path.join(PROJECT_ROOT, "uploads");// for main server use this 
 




// ---------------------- Storages ----------------------


module.exports = {
    UPLOADS_ROOT
};
