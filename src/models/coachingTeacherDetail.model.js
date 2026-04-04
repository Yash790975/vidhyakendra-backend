const mongoose = require('mongoose');

const coachingTeacherDetailSchema = new mongoose.Schema({
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeachersMaster",
    required: true,
    unique: true
  },
  institute_id: {                                           
    type: mongoose.Schema.Types.ObjectId,
    ref: "institutes_master", 
    required: true, 
  },
  role: {
    type: String,
    enum: ['mentor', 'faculty', 'guest_faculty', 'counsellor'],
    required: true
  },
  subjects: {
    type: [String],
    default: null
  },
  batch_ids: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'batches',
    default: null
  },
  payout_model: {
    type: String,
    enum: ['fixed', 'percentage', null],
    default: null
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes
coachingTeacherDetailSchema.index({ teacher_id: 1 });
coachingTeacherDetailSchema.index({ institute_id: 1 });   
coachingTeacherDetailSchema.index({ role: 1 });
coachingTeacherDetailSchema.index({ batch_ids: 1 });

// Compound indexes
coachingTeacherDetailSchema.index({ institute_id: 1, role: 1 });      
coachingTeacherDetailSchema.index({ institute_id: 1, teacher_id: 1 }); 

module.exports = mongoose.model('coaching_teacher_details', coachingTeacherDetailSchema);