const mongoose = require('mongoose');

const studentAttendanceSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'students_master',
    ref: 'StudentsMaster',
    required: true
  },
  class_id: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ClassesMaster', 
    required: true
  },
  section_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClassSections',  
    default: null
  },
  batch_id: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'batches_master',
    ref: 'CoachingBatches',
    default: null
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'leave'],
    required: true
  },
  marked_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'teacher_auth',
    required: true
  }
}, {    
  timestamps: true
});

// Compound unique index to prevent duplicate attendance for same student on same date
studentAttendanceSchema.index({ student_id: 1, date: 1 }, { unique: true });

// Other indexes
studentAttendanceSchema.index({ class_id: 1 });
studentAttendanceSchema.index({ section_id: 1 });
studentAttendanceSchema.index({ batch_id: 1 });  
studentAttendanceSchema.index({ date: 1 });
studentAttendanceSchema.index({ status: 1 });
studentAttendanceSchema.index({ marked_by: 1 });

module.exports = mongoose.model('student_attendance', studentAttendanceSchema);