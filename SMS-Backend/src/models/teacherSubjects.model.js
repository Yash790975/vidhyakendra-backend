
// const mongoose = require('mongoose');

// const teacherSubjectsSchema = new mongoose.Schema({
//   teacher_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "TeachersMaster",
//     required: true
//   },
//   subject_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'subjects_master',
//     required: true
//   },
//   is_primary: {
//     type: Boolean,
//     default: false
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

// teacherSubjectsSchema.index({ teacher_id: 1 });
// teacherSubjectsSchema.index({ subject_id: 1 });
// teacherSubjectsSchema.index({ teacher_id: 1, subject_id: 1 }, { unique: true });

// module.exports = mongoose.model('teacher_subjects', teacherSubjectsSchema);

