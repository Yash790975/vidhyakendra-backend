const mongoose = require('mongoose');

const studentAuthSchema = new mongoose.Schema({  
  student_id: {    
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentsMaster',  
    required: true,
    unique: true   
  },   
  username: {
    type: String,
    required: true,
    trim: true,   
    unique: true,
    description: 'Student code from students_master'
  },
  password_hash: {
    type: String,
    required: true
  },
  password_key: {
    type: String,
    default: null
  },
  is_first_login: {
    type: Boolean,
    default: true
  },
  last_login_at: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'blocked', 'disabled'], 
    default: 'active',
    required: true
  },
  otp: {
    type: String,
    default: null
  },
  otp_expiry: { 
    type: Date,
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes for faster queries
studentAuthSchema.index({ username: 1 });
studentAuthSchema.index({ student_id: 1 });
studentAuthSchema.index({ status: 1 });

module.exports = mongoose.model('student_auth', studentAuthSchema);



































































// const mongoose = require("mongoose");

// const studentAuthSchema = new mongoose.Schema(
//   {   
//     student_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "StudentsMaster",
//       required: true,
//       unique: true,
//     },
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password_hash: {
//       type: String,
//       required: true,
//     },
//     password_key: {
//       type: String,
//       default: null,
//       description: "Temporary password key for first-time login",
//     },
//     is_first_login: {
//       type: Boolean,
//       default: true,
//     },
//     last_login_at: {
//       type: Date,
//       default: null,
//     },
//     status: {
//       type: String,    
//       required: true,
//       enum: ["active", "blocked", "disabled"],
//       default: "active",
//     },
//   },
//   {
//     timestamps: true,
//     collection: "student_auth",
//   }
// );

// // Indexes
// studentAuthSchema.index({ student_id: 1 });
// studentAuthSchema.index({ username: 1 });
// studentAuthSchema.index({ status: 1 });

// module.exports = mongoose.model("StudentAuth", studentAuthSchema);