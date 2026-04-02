// const mongoose = require('mongoose');

// const schoolTeacherRoleSchema = new mongoose.Schema({
//   teacher_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     // ref: 'teachers',
//     ref: "TeachersMaster", 
//     required: true
//   },
//   role_type: {
//     type: String,
//     enum: ['principal', 'vice_principal', 'class_teacher', 'subject_teacher', 'lab_assistant'],
//     required: true
//   },
//   assigned_class: {
//     type: String,
//     trim: true
//   }, 
//   assigned_section: {
//     type: String,
//     trim: true
//   },
//   section: {
//     type: String,
//     default: null,
//     trim: true
//   },
//   subjects: {
//     type: [String],
//     default: null
//   },
//   created_at: {
//     type: Date,
//     default: Date.now
//   },
//   updated_at: {
//     type: Date,
//     default: Date.now
//   }
// }, {
//   timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
// });

// // Indexes for faster queries
// schoolTeacherRoleSchema.index({ teacher_id: 1 });
// schoolTeacherRoleSchema.index({ role_type: 1 });
// schoolTeacherRoleSchema.index({ assigned_class: 1, assigned_section: 1 });

// module.exports = mongoose.model('school_teacher_roles', schoolTeacherRoleSchema);