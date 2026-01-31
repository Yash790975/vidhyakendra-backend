
const mongoose = require('mongoose');

const teacherAttendanceSchema = new mongoose.Schema({
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeachersMaster",
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'half_day', 'leave'],
    required: true
  },
  check_in_time: {
    type: Date,
    default: null
  }, 
  check_out_time: {
    type: Date,
    default: null
  },
  remarks: {
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

teacherAttendanceSchema.index({ teacher_id: 1 });
teacherAttendanceSchema.index({ date: 1 });
teacherAttendanceSchema.index({ status: 1 });

module.exports = mongoose.model('teacher_attendance', teacherAttendanceSchema);
 