const mongoose = require('mongoose');

const subjectsByClassSchema = new mongoose.Schema({
  institute_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'institutes_master', 
    required: true
  },
  class_id: {  
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'classes_master',  
    ref: "ClassesMaster",
    required: true
  },
  section_id: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'classes_sections_master',
    ref: "ClassSections",
    default: null
  },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subjects_master',
    required: true
  },
  subject_code: {
    type: String,
    default: null
  },
  subject_type: {
    type: String,
    enum: ['theory', 'practical', 'both'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
    required: true
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

// Unique compound index — one subject per class+section per institute
subjectsByClassSchema.index(
  { institute_id: 1, class_id: 1, section_id: 1, subject_id: 1 },
  { unique: true }
);

// Supporting indexes
subjectsByClassSchema.index({ institute_id: 1 });
subjectsByClassSchema.index({ class_id: 1 });
subjectsByClassSchema.index({ subject_id: 1 });
subjectsByClassSchema.index({ status: 1 });

module.exports = mongoose.model('subjects_by_class', subjectsByClassSchema);
