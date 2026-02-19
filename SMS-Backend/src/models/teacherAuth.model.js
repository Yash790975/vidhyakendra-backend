
const mongoose = require('mongoose');

const teacherAuthSchema = new mongoose.Schema({  
  teacher_id: {    
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'teachers_master', 
        ref: "TeachersMaster",  
    required: true,
    unique: true   
  },   
  email: {
    type: String,
    required: true,
    trim: true,   
    lowercase: true,
    unique: true
  },
  mobile: {
    type: String,
    trim: true
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
teacherAuthSchema.index({ email: 1 });
teacherAuthSchema.index({ teacher_id: 1 });
teacherAuthSchema.index({ status: 1 });

module.exports = mongoose.model('teacher_auth', teacherAuthSchema);