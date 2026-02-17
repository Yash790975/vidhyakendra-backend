const mongoose = require('mongoose');

const studentStatusHistorySchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId, 
    // ref: 'students_master', 
    ref: 'StudentsMaster', 
    required: true 
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'blocked', 'archived'],
    required: true
  },
  reason: {
    type: String,
    default: null
  },
  changed_at: {
    type: Date,
    required: true,
    default: Date.now
  },
  changed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'institute_admins',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
studentStatusHistorySchema.index({ student_id: 1 });
studentStatusHistorySchema.index({ status: 1 });
studentStatusHistorySchema.index({ changed_at: -1 });
studentStatusHistorySchema.index({ changed_by: 1 });

module.exports = mongoose.model('student_status_history', studentStatusHistorySchema); 