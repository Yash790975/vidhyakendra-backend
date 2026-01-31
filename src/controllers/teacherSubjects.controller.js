// // ============================================
// // controllers/teacherSubjects.controller.js
// // ============================================
// const teacherSubjectsService = require('../services/teacherSubjects.service');
// const {
//   createTeacherSubjectValidation,
//   updateTeacherSubjectValidation,     
//   bulkCreateTeacherSubjectsValidation
// } = require('../validations/teacherSubjects.validation');
// const statusCode = require('../enums/statusCode');

// const createTeacherSubject = async (req, res) => {
//   try {
//     const { error } = createTeacherSubjectValidation.validate(req.body);
//     if (error) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: null,
//         message: error.details[0].message
//       });
//     }

//     const teacherSubject = await teacherSubjectsService.createTeacherSubject(req.body);

//     return res.status(statusCode.CREATED).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.CREATED,
//       result: teacherSubject,
//       message: 'Teacher-subject mapping created successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while creating teacher-subject mapping'
//     });
//   }
// };

// const bulkCreateTeacherSubjects = async (req, res) => {
//   try {
//     const { error } = bulkCreateTeacherSubjectsValidation.validate(req.body);
//     if (error) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: null,
//         message: error.details[0].message
//       });
//     }

//     const result = await teacherSubjectsService.bulkCreateTeacherSubjects(req.body);

//     return res.status(statusCode.CREATED).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.CREATED,
//       result: result,
//       message: 'Teacher subjects created successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while bulk creating teacher subjects'
//     });
//   }
// };

// const getAllTeacherSubjects = async (req, res) => {
//   try {
//     const teacherSubjects = await teacherSubjectsService.getAllTeacherSubjects();

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: teacherSubjects,
//       message: 'Teacher-subject mappings retrieved successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while fetching teacher-subject mappings'
//     });
//   }
// };

// const getTeacherSubjectById = async (req, res) => {
//   try {
//     const teacherSubject = await teacherSubjectsService.getTeacherSubjectById(req.params.id);

//     if (!teacherSubject) {
//       return res.status(statusCode.NOT_FOUND).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.NOT_FOUND,
//         result: null,
//         message: 'Teacher-subject mapping not found'
//       });
//     }

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: teacherSubject,
//       message: 'Teacher-subject mapping retrieved successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while fetching teacher-subject mapping'
//     });
//   }
// };

// const getSubjectsByTeacherId = async (req, res) => {
//   try {
//     const teacherSubjects = await teacherSubjectsService.getSubjectsByTeacherId(req.params.teacher_id);

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: teacherSubjects,
//       message: 'Subjects retrieved successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while fetching subjects'
//     });
//   }
// };

// const getTeachersBySubjectId = async (req, res) => {
//   try {
//     const teacherSubjects = await teacherSubjectsService.getTeachersBySubjectId(req.params.subject_id);

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: teacherSubjects,
//       message: 'Teachers retrieved successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while fetching teachers'
//     });
//   }
// };

// const updateTeacherSubject = async (req, res) => {
//   try {
//     const { error } = updateTeacherSubjectValidation.validate(req.body);
//     if (error) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: null,
//         message: error.details[0].message
//       });
//     }

//     const teacherSubject = await teacherSubjectsService.updateTeacherSubject(req.params.id, req.body);

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: teacherSubject,
//       message: 'Teacher-subject mapping updated successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while updating teacher-subject mapping'
//     });
//   }
// };

// const deleteTeacherSubject = async (req, res) => {
//   try {
//     const result = await teacherSubjectsService.deleteTeacherSubject(req.params.id);

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: result,
//       message: 'Teacher-subject mapping deleted successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while deleting teacher-subject mapping'
//     });
//   }
// };

// const deleteAllSubjectsForTeacher = async (req, res) => {
//   try {
//     const result = await teacherSubjectsService.deleteAllSubjectsForTeacher(req.params.teacher_id);

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: result,
//       message: 'All subjects for teacher deleted successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while deleting subjects'
//     });
//   }
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


