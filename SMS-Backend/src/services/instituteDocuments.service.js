const InstituteDocument = require("../models/instituteDocuments.model");
const Admin = require("../models/Admin"); // ADD THIS - Import Admin model
const CustomError = require("../exceptions/CustomError"); 
const statusCode = require("../enums/statusCode"); 
const fs = require("fs"); 
const path = require("path");

const createDocument = async (documentData) => {
  const existingDocument = await InstituteDocument.findOne({
    institute_id: documentData.institute_id,
    document_type: documentData.document_type,     
  });
 
  if (existingDocument) { 
    throw new CustomError(
      `Document of type ${documentData.document_type} already exists for this institute`,
      statusCode.CONFLICT
    );
  }

  const document = new InstituteDocument(documentData);
  await document.save();
  return document;
};

const getAllDocuments = async (filters = {}) => {
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

  const documents = await InstituteDocument.find(query)
    .populate("institute_id", "institute_name institute_code") 
    .populate({
      path: "verified_by",
      model: "Admin",
      select: "name email"
    })
    .sort({ createdAt: -1 });

  return documents;
};

const getDocumentById = async (documentId) => {
  const document = await InstituteDocument.findById(documentId)
    .populate("institute_id", "institute_name institute_code")
    .populate({
      path: "verified_by",
      model: "Admin",
      select: "name email"
    });

  if (!document) {
    throw new CustomError("Document not found", statusCode.NOT_FOUND);
  }

  return document;
};

const getDocumentsByInstituteId = async (instituteId) => {
  const documents = await InstituteDocument.find({
    institute_id: instituteId,
  })
    .populate({
      path: "verified_by",
      model: "Admin",
      select: "name email"
    });

  return documents;
};

const updateDocument = async (documentId, updateData, newFileUrl = null) => {
  const document = await InstituteDocument.findById(documentId);

  if (!document) {
    throw new CustomError("Document not found", statusCode.NOT_FOUND);
  }

  // If file is being updated, delete the old file
  if (newFileUrl && document.file_url) {
    const oldFilePath = path.join(
      require("../middlewares/upload").UPLOADS_ROOT,
      "institute_documents", 
      path.basename(document.file_url)
    );

    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }
  }

  // Update fields
  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      document[key] = updateData[key];
    }
  });

  if (newFileUrl) {
    document.file_url = newFileUrl;
  }

  await document.save();

  return await InstituteDocument.findById(documentId)
    .populate("institute_id", "institute_name institute_code")
    .populate({
      path: "verified_by",
      model: "Admin",
      select: "name email"
    });
};

const verifyDocument = async (documentId, verificationData) => {
  const document = await InstituteDocument.findById(documentId);

  if (!document) {
    throw new CustomError("Document not found", statusCode.NOT_FOUND);
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

  return await InstituteDocument.findById(documentId)
    .populate("institute_id", "institute_name institute_code")
    .populate({
      path: "verified_by",
      model: "Admin",
      select: "name email"
    });
};

const deleteDocument = async (documentId) => {
  const document = await InstituteDocument.findById(documentId);

  if (!document) {
    throw new CustomError("Document not found", statusCode.NOT_FOUND);
  }

  // Delete the file from uploads folder
  if (document.file_url) {
    const filePath = path.join(
      require("../middlewares/upload").UPLOADS_ROOT,
      "institute_documents",
      path.basename(document.file_url) 
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }  

  await InstituteDocument.findByIdAndDelete(documentId);
  return document;
};

module.exports = {
  createDocument,
  getAllDocuments,
  getDocumentById,
  getDocumentsByInstituteId,
  updateDocument,
  verifyDocument,
  deleteDocument,
};

























































































// const InstituteDocument = require("../models/instituteDocuments.model");
// const CustomError = require("../exceptions/CustomError"); 
// const statusCode = require("../enums/statusCode"); 
// const fs = require("fs"); 
// const path = require("path");

// const createDocument = async (documentData) => {
//   const existingDocument = await InstituteDocument.findOne({
//     institute_id: documentData.institute_id,
//     document_type: documentData.document_type,     
//   });
 
//   if (existingDocument) { 
//     throw new CustomError(
//       `Document of type ${documentData.document_type} already exists for this institute`,
//       statusCode.CONFLICT
//     );
//   }

//   const document = new InstituteDocument(documentData);
//   await document.save();
//   return document;
// };

// const getAllDocuments = async (filters = {}) => {
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

//   const documents = await InstituteDocument.find(query)
//     .populate("institute_id", "institute_name institute_code") 
//     .populate({
//       path: "verified_by",
//       model: "Admin",
//       select: "name email"
//     })
//     .sort({ createdAt: -1 });

//   return documents;
// };

// const getDocumentById = async (documentId) => {
//   const document = await InstituteDocument.findById(documentId)
//     .populate("institute_id", "institute_name institute_code")
//     .populate({
//       path: "verified_by",
//       model: "Admin",
//       select: "name email"
//     });

//   if (!document) {
//     throw new CustomError("Document not found", statusCode.NOT_FOUND);
//   }

//   return document;
// };

// const updateDocument = async (documentId, updateData, newFileUrl = null) => {
//   const document = await InstituteDocument.findById(documentId);

//   if (!document) {
//     throw new CustomError("Document not found", statusCode.NOT_FOUND);
//   }

//   // If file is being updated, delete the old file
//   if (newFileUrl && document.file_url) {
//     const oldFilePath = path.join(
//       require("../middlewares/upload").UPLOADS_ROOT,
//       "institute_documents", 
//       path.basename(document.file_url)
//     );

//     if (fs.existsSync(oldFilePath)) {
//       fs.unlinkSync(oldFilePath);
//     }
//   }

//   // Update fields
//   Object.keys(updateData).forEach((key) => {
//     if (updateData[key] !== undefined) {
//       document[key] = updateData[key];
//     }
//   });

//   if (newFileUrl) {
//     document.file_url = newFileUrl;
//   }

//   await document.save();

//   return await InstituteDocument.findById(documentId)
//     .populate("institute_id", "institute_name institute_code")
//     .populate({
//       path: "verified_by",
//       model: "Admin",
//       select: "name email"
//     });
// };

// const getDocumentsByInstituteId = async (instituteId) => {
//   const documents = await InstituteDocument.find({
//     institute_id: instituteId,
//   }).populate("verified_by", "name email");

//   return documents;
// };




// const verifyDocument = async (documentId, verificationData) => {
//   const document = await InstituteDocument.findById(documentId);

//   if (!document) {
//     throw new CustomError("Document not found", statusCode.NOT_FOUND);
//   }

//   document.verification_status = verificationData.verification_status;
//   document.verified_by = verificationData.verified_by; // This should be the Admin's _id

//   if (verificationData.verification_status === "rejected") {
//     document.rejection_reason = verificationData.rejection_reason;
//   } else { 
//     document.rejection_reason = undefined;
//   }

//   await document.save();

//   // Change the populate reference from InstituteDocument to Admin
//   return await InstituteDocument.findById(documentId)
//     .populate("institute_id", "institute_name institute_code")
//     .populate({
//       path: "verified_by",
//       model: "Admin", // Explicitly specify the Admin model
//       select: "name email"
//     });
// };

// const deleteDocument = async (documentId) => {
//   const document = await InstituteDocument.findById(documentId);

//   if (!document) {
//     throw new CustomError("Document not found", statusCode.NOT_FOUND);
//   }

//   // Delete the file from uploads folder
//   if (document.file_url) {
//     const filePath = path.join(
//       require("../middlewares/upload").UPLOADS_ROOT,
//       "institute_documents",
//       // "instituteDocuments",
//       path.basename(document.file_url) 
//     );

//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//     }
//   }  

//   await InstituteDocument.findByIdAndDelete(documentId);
//   return document;
// };

// module.exports = {
//   createDocument,
//   getAllDocuments,
//   getDocumentById,
//   getDocumentsByInstituteId,
//   updateDocument,
//   verifyDocument,
//   deleteDocument,
// };