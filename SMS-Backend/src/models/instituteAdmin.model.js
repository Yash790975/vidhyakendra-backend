// models/instituteAdmin.model.js
const mongoose = require('mongoose');

const instituteAdminSchema = new mongoose.Schema({
  institute_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'institutes_master',
    required: true  
  }, 
  name: {
    type: String,   
    required: true,  
    trim: true
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
    required: true,
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
    default: Date.now,
    required: true
  },
  updated_at: {
    type: Date, 
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Index for faster queries
instituteAdminSchema.index({ email: 1 });
instituteAdminSchema.index({ institute_id: 1 });
instituteAdminSchema.index({ status: 1 });

module.exports = mongoose.model('institute_admins', instituteAdminSchema);