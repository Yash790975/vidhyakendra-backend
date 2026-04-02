

// const TeacherSubjects = require('../models/teacherSubjects.model');
// const statusCode = require('../enums/statusCode');

// const createTeacherSubject = async (data) => {
//   // Check if mapping already exists
//   const existing = await TeacherSubjects.findOne({
//     teacher_id: data.teacher_id,
//     subject_id: data.subject_id
//   });

//   if (existing) {
//     const error = new Error('This teacher-subject mapping already exists');
//     error.statusCode = statusCode.CONFLICT;
//     throw error;
//   }

//   const teacherSubject = new TeacherSubjects(data);
//   await teacherSubject.save();
  
//   const populated = await TeacherSubjects.findById(teacherSubject._id)
//     .populate("teacher_id", "full_name teacher_code")
//     .populate('subject_id', 'subject_name subject_code subject_type');
  
//   return populated;
// };

// const bulkCreateTeacherSubjects = async (data) => {
//   const { teacher_id, subjects } = data;
  
//   const createdSubjects = [];
//   const errors = [];

//   for (const subject of subjects) {
//     try {
//       // Check if mapping already exists
//       const existing = await TeacherSubjects.findOne({
//         teacher_id: teacher_id,
//         subject_id: subject.subject_id
//       });

//       if (!existing) {
//         const teacherSubject = new TeacherSubjects({
//           teacher_id: teacher_id,
//           subject_id: subject.subject_id,
//           is_primary: subject.is_primary || false
//         });
//         await teacherSubject.save();
        
//         const populated = await TeacherSubjects.findById(teacherSubject._id)
//           .populate("teacher_id", "full_name teacher_code")
//           .populate('subject_id', 'subject_name subject_code subject_type');
        
//         createdSubjects.push(populated);
//       } else {
//         errors.push({ subject_id: subject.subject_id, error: 'Already exists' });
//       }
//     } catch (err) {
//       errors.push({ subject_id: subject.subject_id, error: err.message });
//     }
//   }

//   return { createdSubjects, errors };
// };

// const getAllTeacherSubjects = async () => {
//   const teacherSubjects = await TeacherSubjects.find()
//     .populate("teacher_id", "full_name teacher_code")
//     .populate('subject_id', 'subject_name subject_code subject_type');
  
//   return teacherSubjects;
// };

// const getTeacherSubjectById = async (id) => {
//   const teacherSubject = await TeacherSubjects.findById(id)
//     .populate("teacher_id", "full_name teacher_code")
//     .populate('subject_id', 'subject_name subject_code subject_type');
  
//   return teacherSubject;
// };

// const getSubjectsByTeacherId = async (teacherId) => {
//   const teacherSubjects = await TeacherSubjects.find({ teacher_id: teacherId })
//     .populate("teacher_id", "full_name teacher_code")
//     .populate('subject_id', 'subject_name subject_code subject_type');
  
//   return teacherSubjects;
// };

// const getTeachersBySubjectId = async (subjectId) => {
//   const teacherSubjects = await TeacherSubjects.find({ subject_id: subjectId })
//     .populate("teacher_id", "full_name teacher_code")
//     .populate('subject_id', 'subject_name subject_code subject_type');
  
//   return teacherSubjects;
// };

// const updateTeacherSubject = async (id, data) => {
//   const teacherSubject = await TeacherSubjects.findById(id);
//   if (!teacherSubject) {
//     const error = new Error('Teacher-subject mapping not found');
//     error.statusCode = statusCode.NOT_FOUND;
//     throw error;
//   }

//   Object.assign(teacherSubject, data); 
//   await teacherSubject.save();

//   const updated = await TeacherSubjects.findById(id)
//     .populate("teacher_id", "full_name teacher_code")
//     .populate('subject_id', 'subject_name subject_code subject_type');

//   return updated;
// };

// const deleteTeacherSubject = async (id) => {
//   const teacherSubject = await TeacherSubjects.findByIdAndDelete(id);
//   if (!teacherSubject) {
//     const error = new Error('Teacher-subject mapping not found');
//     error.statusCode = statusCode.NOT_FOUND;
//     throw error;
//   }

//   return { message: 'Teacher-subject mapping deleted successfully' };
// };

// const deleteAllSubjectsForTeacher = async (teacherId) => {
//   const result = await TeacherSubjects.deleteMany({ teacher_id: teacherId });
  
//   return { 
//     message: 'All subjects for teacher deleted successfully',
//     deletedCount: result.deletedCount 
//   };
// };

// module.exports = {
//   createTeacherSubject,
//   bulkCreateTeacherSubjects, 
//   getAllTeacherSubjects,
//   getTeacherSubjectById,
//   getSubjectsByTeacherId,
//   getTeachersBySubjectId,
//   updateTeacherSubject,
//   deleteTeacherSubject,
//   deleteAllSubjectsForTeacher
// };

