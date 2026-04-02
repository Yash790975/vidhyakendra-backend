// src/services/institute_identity_documents.service.js

const InstituteIdentityDocument = require("../models/instituteIdentityDocuments.model");
const Admin = require("../models/Admin"); // ADD THIS - Import Admin model
const CustomError = require("../exceptions/CustomError"); 
const statusCode = require("../enums/statusCode"); 
const crypto = require("crypto"); 

// Encryption key - should be stored in environment variables 
const INSTITUTE_IDENTITY_ENCRYPTION_KEY = process.env.INSTITUTE_IDENTITY_ENCRYPTION_KEY || "your-32-character-secret-key!!";
const INSTITUTE_IDENTITY_ENCRYPTION_IV = process.env.INSTITUTE_IDENTITY_ENCRYPTION_IV || "your-16-char-iv";

// Encrypt document number 
const encryptDocumentNumber = (documentNumber) => {
  try {
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(INSTITUTE_IDENTITY_ENCRYPTION_KEY.padEnd(32, "0").slice(0, 32)),
      Buffer.from(INSTITUTE_IDENTITY_ENCRYPTION_IV.padEnd(16, "0").slice(0, 16))
    );
    let encrypted = cipher.update(documentNumber, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  } catch (error) {
    throw new CustomError(
      "Encryption failed",
      statusCode.INTERNAL_SERVER_ERROR,
      true
    );
  }
};

// Decrypt document number
const decryptDocumentNumber = (encryptedNumber) => {
  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(INSTITUTE_IDENTITY_ENCRYPTION_KEY.padEnd(32, "0").slice(0, 32)),
      Buffer.from(INSTITUTE_IDENTITY_ENCRYPTION_IV.padEnd(16, "0").slice(0, 16))
    );
    let decrypted = decipher.update(encryptedNumber, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    throw new CustomError(
      "Decryption failed",
      statusCode.INTERNAL_SERVER_ERROR,
      true
    );
  }
};

// Generate masked number
const generateMaskedNumber = (documentNumber, documentType) => {
  if (documentType === "aadhaar") {
    const last4 = documentNumber.slice(-4);
    return `XXXX-XXXX-${last4}`;
  } else if (documentType === "pan") {
    const last4 = documentNumber.slice(-4);
    return `XXXXX${last4}`;
  }
  return "XXXX-XXXX-XXXX";
};

// Create identity document
const createIdentityDocument = async (documentData) => {
  const existingDocument = await InstituteIdentityDocument.findOne({
    institute_id: documentData.institute_id,
    document_type: documentData.document_type,
  });

  if (existingDocument) {
    throw new CustomError(
      `${documentData.document_type.toUpperCase()} already exists for this institute`,
      statusCode.CONFLICT
    );
  }

  const encryptedNumber = encryptDocumentNumber(documentData.document_number);
  const maskedNumber = generateMaskedNumber(
    documentData.document_number,
    documentData.document_type
  );

  const identityDocument = new InstituteIdentityDocument({
    institute_id: documentData.institute_id,
    document_type: documentData.document_type,
    document_number: encryptedNumber,
    masked_number: maskedNumber,
    verification_status: "pending",
  });

  await identityDocument.save();

  const result = identityDocument.toObject();
  delete result.document_number;

  return result;
};

// Get all identity documents
const getAllIdentityDocuments = async (filters = {}) => {
  const query = {};

  if (filters.institute_id) {
    query.institute_id = filters.institute_id;
  }

  if (filters.document_type) {
    query.document_type = filters.document_type;
  }

  if (filters.verification_status) {
    query.verification_status = filters.verification_status;
  }

  const documents = await InstituteIdentityDocument.find(query)
    .populate("institute_id", "institute_name institute_code") 
    .populate({
      path: "verified_by",
      model: "Admin",
      select: "name email"
    })
    .select("-document_number")
    .sort({ createdAt: -1 });

  return documents;
};

// Get identity document by ID
const getIdentityDocumentById = async (documentId, includeDecrypted = false) => {
  const document = await InstituteIdentityDocument.findById(documentId)
    .populate("institute_id", "institute_name institute_code")
    .populate({
      path: "verified_by",
      model: "Admin",
      select: "name email"
    });

  if (!document) {
    throw new CustomError("Identity document not found", statusCode.NOT_FOUND);
  }

  const result = document.toObject();

  if (includeDecrypted) {
    result.decrypted_number = decryptDocumentNumber(result.document_number);
  }

  delete result.document_number;

  return result;
};

// Get identity documents by institute ID
const getIdentityDocumentsByInstituteId = async (instituteId) => {
  const documents = await InstituteIdentityDocument.find({
    institute_id: instituteId,
  })
    .populate({
      path: "verified_by",
      model: "Admin",
      select: "name email"
    })
    .select("-document_number");

  return documents;
};

// Update identity document
const updateIdentityDocument = async (documentId, updateData) => {
  const document = await InstituteIdentityDocument.findById(documentId);

  if (!document) {
    throw new CustomError("Identity document not found", statusCode.NOT_FOUND);
  }

  if (updateData.document_number) {
    updateData.document_number = encryptDocumentNumber(
      updateData.document_number
    );
    updateData.masked_number = generateMaskedNumber(
      updateData.document_number,
      document.document_type
    );
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      document[key] = updateData[key];
    }
  });

  await document.save();

  const result = await InstituteIdentityDocument.findById(documentId)
    .populate("institute_id", "institute_name institute_code")
    .populate({
      path: "verified_by",
      model: "Admin",
      select: "name email"
    })
    .select("-document_number");

  return result;
};

// Verify identity document
const verifyIdentityDocument = async (documentId, verificationData) => {
  const document = await InstituteIdentityDocument.findById(documentId);

  if (!document) {
    throw new CustomError("Identity document not found", statusCode.NOT_FOUND);
  }

  // ADDED: Verify that the admin exists
  const admin = await Admin.findById(verificationData.verified_by);
  if (!admin) {
    throw new CustomError(
      "Admin not found. Please provide a valid Admin ObjectId",
      statusCode.NOT_FOUND
    );
  }

  document.verification_status = verificationData.verification_status;
  document.verified_by = verificationData.verified_by;

  if (verificationData.verification_status === "rejected") {
    document.rejection_reason = verificationData.rejection_reason;
  } else {
    document.rejection_reason = undefined;
  }

  await document.save();

  const result = await InstituteIdentityDocument.findById(documentId)
    .populate("institute_id", "institute_name institute_code")
    .populate({
      path: "verified_by",
      model: "Admin",
      select: "name email"
    })
    .select("-document_number");

  return result;
};

// Delete identity document
const deleteIdentityDocument = async (documentId) => {
  const document = await InstituteIdentityDocument.findById(documentId);

  if (!document) {
    throw new CustomError("Identity document not found", statusCode.NOT_FOUND);
  }

  await InstituteIdentityDocument.findByIdAndDelete(documentId);

  const result = document.toObject();
  delete result.document_number;

  return result;
};

module.exports = {
  createIdentityDocument,
  getAllIdentityDocuments,
  getIdentityDocumentById,
  getIdentityDocumentsByInstituteId,
  updateIdentityDocument,  
  verifyIdentityDocument,
  deleteIdentityDocument,
  decryptDocumentNumber,
};

















































































// // src/services/institute_identity_documents.service.js

// const InstituteIdentityDocument = require("../models/instituteIdentityDocuments.model");
// // const CustomError = require("../exceptions/customError"); 
// const CustomError = require("../exceptions/CustomError"); 
// const statusCode = require("../enums/statusCode"); 
// const crypto = require("crypto"); 

// // Encryption key - should be stored in environment variables 
// const INSTITUTE_IDENTITY_ENCRYPTION_KEY = process.env.INSTITUTE_IDENTITY_ENCRYPTION_KEY || "your-32-character-secret-key!!"; // Must be 32 characters
// const INSTITUTE_IDENTITY_ENCRYPTION_IV = process.env.INSTITUTE_IDENTITY_ENCRYPTION_IV || "your-16-char-iv"; // Must be 16 characters

// // Encrypt document number 
// const encryptDocumentNumber = (documentNumber) => {
//   try {
//     const cipher = crypto.createCipheriv(
//       "aes-256-cbc",
//       Buffer.from(INSTITUTE_IDENTITY_ENCRYPTION_KEY.padEnd(32, "0").slice(0, 32)),
//       Buffer.from(INSTITUTE_IDENTITY_ENCRYPTION_IV.padEnd(16, "0").slice(0, 16))
//     );
//     let encrypted = cipher.update(documentNumber, "utf8", "hex");
//     encrypted += cipher.final("hex");
//     return encrypted;
//   } catch (error) {
//     throw new CustomError(
//       "Encryption failed",
//       statusCode.INTERNAL_SERVER_ERROR,
//       true
//     );
//   }
// };

// // Decrypt document number
// const decryptDocumentNumber = (encryptedNumber) => {
//   try {
//     const decipher = crypto.createDecipheriv(
//       "aes-256-cbc",
//       Buffer.from(INSTITUTE_IDENTITY_ENCRYPTION_KEY.padEnd(32, "0").slice(0, 32)),
//       Buffer.from(INSTITUTE_IDENTITY_ENCRYPTION_IV.padEnd(16, "0").slice(0, 16))
//     );
//     let decrypted = decipher.update(encryptedNumber, "hex", "utf8");
//     decrypted += decipher.final("utf8");
//     return decrypted;
//   } catch (error) {
//     throw new CustomError(
//       "Decryption failed",
//       statusCode.INTERNAL_SERVER_ERROR,
//       true
//     );
//   }
// };

// // Generate masked number
// const generateMaskedNumber = (documentNumber, documentType) => {
//   if (documentType === "aadhaar") {
//     // Show last 4 digits: XXXX-XXXX-1234
//     const last4 = documentNumber.slice(-4);
//     return `XXXX-XXXX-${last4}`;
//   } else if (documentType === "pan") {
//     // Show last 4 characters: XXXXX1234X
//     const last4 = documentNumber.slice(-4);
//     return `XXXXX${last4}`;
//   }
//   return "XXXX-XXXX-XXXX";
// };

// // Create identity document
// const createIdentityDocument = async (documentData) => {
//   // Check if document already exists
//   const existingDocument = await InstituteIdentityDocument.findOne({
//     institute_id: documentData.institute_id,
//     document_type: documentData.document_type,
//   });

//   if (existingDocument) {
//     throw new CustomError(
//       `${documentData.document_type.toUpperCase()} already exists for this institute`,
//       statusCode.CONFLICT
//     );
//   }

//   // Encrypt document number
//   const encryptedNumber = encryptDocumentNumber(documentData.document_number);

//   // Generate masked number
//   const maskedNumber = generateMaskedNumber(
//     documentData.document_number,
//     documentData.document_type
//   );

//   const identityDocument = new InstituteIdentityDocument({
//     institute_id: documentData.institute_id,
//     document_type: documentData.document_type,
//     document_number: encryptedNumber,
//     masked_number: maskedNumber,
//     verification_status: "pending",
//   });

//   await identityDocument.save();

//   // Return document without encrypted number
//   const result = identityDocument.toObject();
//   delete result.document_number;

//   return result;
// };

// // Get all identity documents
// const getAllIdentityDocuments = async (filters = {}) => {
//   const query = {};

//   if (filters.institute_id) {
//     query.institute_id = filters.institute_id;
//   }

//   if (filters.document_type) {
//     query.document_type = filters.document_type;
//   }

//   if (filters.verification_status) {
//     query.verification_status = filters.verification_status;
//   }

//   const documents = await InstituteIdentityDocument.find(query)
//     .populate("institute_id", "institute_name institute_code") 
//     .populate({
//       path: "verified_by",
//       model: "Admin", // UPDATED: Reference Admin model
//       select: "name email"
//     })
//     .select("-document_number") // Exclude encrypted number
//     .sort({ createdAt: -1 });

//   return documents;
// };

// // Get identity document by ID
// const getIdentityDocumentById = async (documentId, includeDecrypted = false) => {
//   const document = await InstituteIdentityDocument.findById(documentId)
//     .populate("institute_id", "institute_name institute_code")
//     .populate({
//       path: "verified_by",
//       model: "Admin", // UPDATED: Reference Admin model
//       select: "name email"
//     });

//   if (!document) {
//     throw new CustomError("Identity document not found", statusCode.NOT_FOUND);
//   }

//   const result = document.toObject();

//   if (includeDecrypted) {
//     // Decrypt for authorized users (admins)
//     result.decrypted_number = decryptDocumentNumber(result.document_number);
//   }

//   delete result.document_number;

//   return result;
// };

// // Get identity documents by institute ID
// const getIdentityDocumentsByInstituteId = async (instituteId) => {
//   const documents = await InstituteIdentityDocument.find({
//     institute_id: instituteId,
//   })
//     .populate({
//       path: "verified_by",
//       model: "Admin", // UPDATED: Reference Admin model
//       select: "name email"
//     })
//     .select("-document_number");

//   return documents;
// };

// // Update identity document
// const updateIdentityDocument = async (documentId, updateData) => {
//   const document = await InstituteIdentityDocument.findById(documentId);

//   if (!document) {
//     throw new CustomError("Identity document not found", statusCode.NOT_FOUND);
//   }

//   // If document number is being updated, encrypt it
//   if (updateData.document_number) {
//     updateData.document_number = encryptDocumentNumber(
//       updateData.document_number
//     );
//     updateData.masked_number = generateMaskedNumber(
//       updateData.document_number,
//       document.document_type
//     );
//   }

//   // Update fields
//   Object.keys(updateData).forEach((key) => {
//     if (updateData[key] !== undefined) {
//       document[key] = updateData[key];
//     }
//   });

//   await document.save();

//   const result = await InstituteIdentityDocument.findById(documentId)
//     .populate("institute_id", "institute_name institute_code")
//     .populate({
//       path: "verified_by",
//       model: "Admin", // UPDATED: Reference Admin model
//       select: "name email"
//     })
//     .select("-document_number");

//   return result;
// };

// // Verify identity document
// const verifyIdentityDocument = async (documentId, verificationData) => {
//   const document = await InstituteIdentityDocument.findById(documentId);

//   if (!document) {
//     throw new CustomError("Identity document not found", statusCode.NOT_FOUND);
//   }

//   document.verification_status = verificationData.verification_status;
//   document.verified_by = verificationData.verified_by; // This will come from controller with admin ID

//   if (verificationData.verification_status === "rejected") {
//     document.rejection_reason = verificationData.rejection_reason;
//   } else {
//     document.rejection_reason = undefined;
//   }

//   await document.save();

//   const result = await InstituteIdentityDocument.findById(documentId)
//     .populate("institute_id", "institute_name institute_code")
//     .populate({
//       path: "verified_by",
//       model: "Admin", // UPDATED: Reference Admin model
//       select: "name email"
//     })
//     .select("-document_number");

//   return result;
// };

// // Delete identity document
// const deleteIdentityDocument = async (documentId) => {
//   const document = await InstituteIdentityDocument.findById(documentId);

//   if (!document) {
//     throw new CustomError("Identity document not found", statusCode.NOT_FOUND);
//   }

//   await InstituteIdentityDocument.findByIdAndDelete(documentId);

//   const result = document.toObject();
//   delete result.document_number;

//   return result;
// };




// module.exports = {
//   createIdentityDocument,
//   getAllIdentityDocuments,
//   getIdentityDocumentById,
//   getIdentityDocumentsByInstituteId,
//   updateIdentityDocument,  
//   verifyIdentityDocument,
//   deleteIdentityDocument,
//   decryptDocumentNumber,
// };
