const TeacherIdentityDocuments = require("../models/teacherIdentityDocuments.model");
const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode"); 
const crypto = require("crypto");
const fs = require("fs"); 
const path = require("path"); 

// ============= IDENTITY DOCUMENTS (with encryption & files) =============

// Encryption helpers
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "your-32-character-secret-key!!"; 
const ENCRYPTION_IV = process.env.ENCRYPTION_IV || "your-16-char-iv";

const encryptDocumentNumber = (documentNumber) => {
  try {
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(ENCRYPTION_KEY.padEnd(32, "0").slice(0, 32)),
      Buffer.from(ENCRYPTION_IV.padEnd(16, "0").slice(0, 16))
    );
    let encrypted = cipher.update(documentNumber, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  } catch (error) {
    throw new CustomError("Encryption failed", statusCode.INTERNAL_SERVER_ERROR, true);
  }
}; 

const generateMaskedNumber = (documentNumber, documentType) => {
  if (documentType === "pan_card") {
    const last4 = documentNumber.slice(-4);
    return `XXXXX${last4}`;
  } else if (documentType === "address_card") {
    const last4 = documentNumber.slice(-4);
    return `XXXX-XXXX-${last4}`;
  }
  return "XXXX-XXXX-XXXX";
};

const createIdentityDocument = async (documentData, fileUrl) => {
  // Check if document already exists
  const existing = await TeacherIdentityDocuments.findOne({
    teacher_id: documentData.teacher_id,
    document_type: documentData.document_type,
  });

  if (existing) {
    throw new CustomError(
      `${documentData.document_type} already exists for this teacher`,
      statusCode.CONFLICT
    );
  }

  let encryptedNumber = documentData.document_number;
  let maskedNumber = null;

  // Only encrypt and mask for pan_card and address_card
  if (documentData.document_type !== "photo") {
    encryptedNumber = encryptDocumentNumber(documentData.document_number);
    maskedNumber = generateMaskedNumber(
      documentData.document_number,
      documentData.document_type
    );
  }

  const identityDoc = new TeacherIdentityDocuments({
    teacher_id: documentData.teacher_id,
    document_type: documentData.document_type,
    document_number: encryptedNumber,
    masked_number: maskedNumber,
    file_url: fileUrl,
    verification_status: "pending",
  });

  await identityDoc.save();

  const result = identityDoc.toObject();
  delete result.document_number;

  return result;
};

// const getIdentityDocumentsByTeacherId = async (teacherId) => {
//   const documents = await TeacherIdentityDocuments.find({
//     teacher_id: teacherId,
//   }).select("-document_number");

//   return documents;
// };

const updateIdentityDocument = async (documentId, updateData, newFileUrl = null) => {
  const document = await TeacherIdentityDocuments.findById(documentId);

  if (!document) {
    throw new CustomError("Identity document not found", statusCode.NOT_FOUND);
  }

  // Delete old file if new file is uploaded
  if (newFileUrl && document.file_url) {
    const oldFilePath = path.join(
      require("../middlewares/upload").UPLOADS_ROOT,
      "teacher_identity_documents",
      path.basename(document.file_url)
    );

    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }
  }

  if (newFileUrl) {
    document.file_url = newFileUrl;
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      document[key] = updateData[key];
    }
  });

  await document.save();

  const result = document.toObject();
  delete result.document_number;

  return result;
};
 
const deleteIdentityDocument = async (documentId) => {
  const document = await TeacherIdentityDocuments.findById(documentId);

  if (!document) {
    throw new CustomError("Identity document not found", statusCode.NOT_FOUND);
  }

  // Delete file
  if (document.file_url) {
    const filePath = path.join(
      require("../middlewares/upload").UPLOADS_ROOT,
      "teacher_identity_documents",
      path.basename(document.file_url)
    ); 

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  await TeacherIdentityDocuments.findByIdAndDelete(documentId);

  const result = document.toObject();
  delete result.document_number;

  return result;
};


const verifyIdentityDocument = async (documentId, verificationData) => {
  const document = await TeacherIdentityDocuments.findById(documentId);

  if (!document) {
    throw new CustomError("Identity document not found", statusCode.NOT_FOUND);
  }

  document.verification_status = verificationData.verification_status;
  document.verified_by = verificationData.verified_by; // Institute admin ID

  if (verificationData.verification_status === "rejected") {
    document.rejection_reason = verificationData.rejection_reason;
  } else {
    document.rejection_reason = undefined;
  }

  await document.save();

  // Populate and return
  const result = await TeacherIdentityDocuments.findById(documentId)
    .populate("teacher_id", "full_name teacher_code") 
    .populate({
      path: "verified_by",
      model: "institute_admins",
      select: "name email"
    })
    .select("-document_number");

  return result;
};


const getIdentityDocumentsByTeacherId = async (teacherId) => {
  const documents = await TeacherIdentityDocuments.find({
    teacher_id: teacherId,
  }).populate("teacher_id", "full_name teacher_code")
    .populate({
      path: "verified_by",
      model: "institute_admins",
      select: "name email"
    })
    .select("-document_number");

  return documents;
};


// Get all identity documents (admin)
const getAllIdentityDocuments = async () => {
  const documents = await TeacherIdentityDocuments.find()
    .populate("teacher_id", "full_name teacher_code")
    .populate({
      path: "verified_by",
      model: "institute_admins",
      select: "name email"
    })
    .select("-document_number")
    .sort({ createdAt: -1 });

  return documents;
};

// Get identity document by ID
const getIdentityDocumentById = async (documentId) => {
  const document = await TeacherIdentityDocuments.findById(documentId)
    .populate("teacher_id", "full_name teacher_code")
    .populate({ 
      path: "verified_by",
      model: "institute_admins",
      select: "name email"
    })
    .select("-document_number");

  if (!document) {
    throw new CustomError("Identity document not found", statusCode.NOT_FOUND);
  }

  return document;
};
module.exports = {
  createIdentityDocument,
  getIdentityDocumentsByTeacherId,
  getAllIdentityDocuments,
  getIdentityDocumentById,
  updateIdentityDocument,
  verifyIdentityDocument,
  deleteIdentityDocument 
};
