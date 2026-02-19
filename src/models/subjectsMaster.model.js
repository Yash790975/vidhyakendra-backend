const mongoose = require('mongoose');

const subjectsMasterSchema = new mongoose.Schema({
  institute_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'institutes_master',
    required: true
  },
  subject_name: {
    type: String,
    required: true,
    trim: true
  },
  subject_code: {
    type: String,
    default: null
  },
  subject_type: {
    type: String,
    enum: ['school', 'coaching'],
    required: true
  },
  class_levels: {
    type: [String],
    default: null
  },
  description: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
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

// Indexes
subjectsMasterSchema.index({ institute_id: 1, subject_name: 1 }, { unique: true }); // unique compound index
subjectsMasterSchema.index({ subject_type: 1 });
subjectsMasterSchema.index({ status: 1 });
subjectsMasterSchema.index({ subject_code: 1 });

module.exports = mongoose.model('subjects_master', subjectsMasterSchema);

































































// const mongoose = require('mongoose');

// const subjectsMasterSchema = new mongoose.Schema({
//   institute_id: {   
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'institutes_master',
//     required: true 
//   },
//   subject_name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   subject_code: {
//     type: String,
//   },
//   subject_type: {
//     type: String,
//     enum: ['school', 'coaching'],
//     required: true
//   },
//   class_levels: {
//     type: [String],
//     default: null
//   },
//   description: {
//     type: String,
//     default: null
//   },
//   status: {
//     type: String,
//     enum: ['active', 'inactive', 'archived'],
//     default: 'active',
//     required: true
//   },
//   created_at: {
//     type: Date,
//     default: Date.now,
//     required: true
//   },
//   updated_at: {
//     type: Date,
//     default: Date.now
//   }
// }, {
//   timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
// });

// // Indexes
// subjectsMasterSchema.index({ institute_id: 1 });
// subjectsMasterSchema.index({ subject_type: 1 });
// subjectsMasterSchema.index({ status: 1 });
// subjectsMasterSchema.index({ subject_code: 1 });

// module.exports = mongoose.model('subjects_master', subjectsMasterSchema);

