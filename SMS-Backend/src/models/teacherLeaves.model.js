
const mongoose = require('mongoose');

const teacherLeavesSchema = new mongoose.Schema({
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeachersMaster",     
    required: true
  },
  leave_type: {
    type: String,
    enum: [
      'casual', 'sick', 'paid', 'unpaid', 'earned',
      'maternity', 'paternity', 'bereavement', 'marriage',
      'study', 'work_from_home', 'half_day',
      'optional_holiday', 'restricted_holiday'
    ],
    required: true
  },
  from_date: {
    type: Date,
    required: true
  },
  to_date: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    required: true
  },
  approved_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'institute_admins',   
    default: null
  },
  approved_at: {
    type: Date,
    default: null
  },
  rejection_reason: {
    type: String,
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

teacherLeavesSchema.index({ teacher_id: 1 });
teacherLeavesSchema.index({ status: 1 });
teacherLeavesSchema.index({ from_date: 1 });

module.exports = mongoose.model('teacher_leaves', teacherLeavesSchema);
