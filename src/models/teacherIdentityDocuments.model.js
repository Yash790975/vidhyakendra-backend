const mongoose = require("mongoose");

const teacherIdentityDocumentsSchema = new mongoose.Schema(
  {
    teacher_id: {    
      type: mongoose.Schema.Types.ObjectId,     
      ref: "TeachersMaster", 
      required: true,
    },
    document_type: {   
      type: String,
      required: true,
      enum: ["pan_card", "address_card", "passport", "driving_license", "photo"],    
    },
    document_number: {
      type: String,
      required: true,
      description: "Encrypted value",
    },  
    masked_number: {
      type: String,
      description: "XXXX-XXXX-1234",
    },
    verification_status: {
      type: String,
      required: true,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    }, 
    file_url: {
      type: String,
      required: true,
    },  
    verified_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "institute_admins",   
    },
    rejection_reason: {
      type: String,
    }, 
  },
  { 
    timestamps: true,
    collection: "teacher_identity_documents" 
  }
); 

// Compound unique index 
teacherIdentityDocumentsSchema.index(
  { teacher_id: 1, document_type: 1 },
  { unique: true }
); 

teacherIdentityDocumentsSchema.index({ verification_status: 1 });

module.exports = mongoose.model(
  "TeacherIdentityDocuments",
  teacherIdentityDocumentsSchema
);














































// const mongoose = require("mongoose");

// const teacherIdentityDocumentsSchema = new mongoose.Schema(
//   {
//     teacher_id: {    
//       type: mongoose.Schema.Types.ObjectId,     
//       // ref: "teachers_master",  
//       ref: "TeachersMaster", 
//       required: true,
//     },
//     document_type: {   
//       type: String,
//       required: true,
//       enum: ["pan_card", "address_card", "photo", ],    
//     },
//     document_number: {
//       type: String,
//       required: true,
//       description: "Encrypted value",
//     },  
//     masked_number: {
//       type: String,
//       description: "XXXX-XXXX-1234",
//     },
//     verification_status: {
//       type: String,
//       required: true,
//       enum: ["pending", "approved", "rejected"],
//       default: "pending",
//     }, 
//     file_url: {
//       type: String,
//       required: true,
//     },  
//     verified_by: {
//       type: mongoose.Schema.Types.ObjectId,
//       // ref: "Admin",  
//       ref: "institute_admins",   
//     },
//     rejection_reason: {
//       type: String,
//     }, 
//   },
//   { 
//     timestamps: true,
//     collection: "teacher_identity_documents"
//   }
// ); 

// // Compound unique index
// teacherIdentityDocumentsSchema.index(
//   { teacher_id: 1, document_type: 1 },
//   { unique: true }
// ); 

// teacherIdentityDocumentsSchema.index({ verification_status: 1 });

// module.exports = mongoose.model(
//   "TeacherIdentityDocuments",
//   teacherIdentityDocumentsSchema
// );