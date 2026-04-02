// // src/controllers/schoolTeacherRole.controller.js

// const schoolTeacherRoleService = require('../services/schoolTeacherRole.service');
// const {
//   createRoleValidation,
//   updateRoleValidation, 
//   getByRoleTypeValidation
// } = require('../validations/schoolTeacherRole.validation');
// const statusCode = require('../enums/statusCode');

// const createRole = async (req, res) => {
//   try {
//     const { error } = createRoleValidation.validate(req.body);
//     if (error) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: null,
//         message: error.details[0].message
//       });
//     }

//     const role = await schoolTeacherRoleService.createRole(req.body);

//     return res.status(statusCode.CREATED).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.CREATED,
//       result: role,
//       message: 'School teacher role created successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while creating role'
//     });
//   }
// };

// const getAllRoles = async (req, res) => {
//   try {
//     const roles = await schoolTeacherRoleService.getAllRoles();

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: roles,
//       message: 'School teacher roles retrieved successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while fetching roles'
//     });
//   }
// };

// const getRoleById = async (req, res) => {
//   try {
//     const role = await schoolTeacherRoleService.getRoleById(req.params.id);

//     if (!role) {
//       return res.status(statusCode.NOT_FOUND).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.NOT_FOUND,
//         result: null,
//         message: 'Role not found'
//       });
//     }

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: role,
//       message: 'Role retrieved successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while fetching role'
//     });
//   }
// };

// const getRolesByTeacherId = async (req, res) => {
//   try {
//     const roles = await schoolTeacherRoleService.getRolesByTeacherId(req.params.teacherId);

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: roles,
//       message: 'Teacher roles retrieved successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while fetching teacher roles'
//     });
//   }
// };

// const getRolesByType = async (req, res) => {
//   try {
//     const { error } = getByRoleTypeValidation.validate({ role_type: req.params.roleType });
//     if (error) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: null,
//         message: error.details[0].message
//       });
//     }

//     const roles = await schoolTeacherRoleService.getRolesByType(req.params.roleType);

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: roles,
//       message: `${req.params.roleType} roles retrieved successfully`
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while fetching roles by type'
//     });
//   }
// };

// const getRolesByClassSection = async (req, res) => {
//   try {
//     const { assignedClass, assignedSection } = req.query;

//     const roles = await schoolTeacherRoleService.getRolesByClassSection(assignedClass, assignedSection);

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: roles,
//       message: 'Roles retrieved successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while fetching roles'
//     });
//   }
// };

// const getClassTeacher = async (req, res) => {
//   try {
//     const { assignedClass, assignedSection } = req.query;

//     if (!assignedClass || !assignedSection) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: null,
//         message: 'Both assignedClass and assignedSection are required'
//       });
//     }

//     const classTeacher = await schoolTeacherRoleService.getClassTeacher(assignedClass, assignedSection);

//     if (!classTeacher) {
//       return res.status(statusCode.NOT_FOUND).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.NOT_FOUND,
//         result: null,
//         message: 'Class teacher not found for this class and section'
//       });
//     }

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: classTeacher,
//       message: 'Class teacher retrieved successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while fetching class teacher'
//     });
//   }
// };

// const getTeachersBySubject = async (req, res) => {
//   try {
//     const { subject } = req.params;

//     if (!subject) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: null,
//         message: 'Subject is required'
//       });
//     }

//     const teachers = await schoolTeacherRoleService.getTeachersBySubject(subject);

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: teachers,
//       message: `Teachers for subject ${subject} retrieved successfully`
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

// const updateRole = async (req, res) => {
//   try {
//     const { error } = updateRoleValidation.validate(req.body);
//     if (error) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: null,
//         message: error.details[0].message
//       });
//     }

//     const role = await schoolTeacherRoleService.updateRole(req.params.id, req.body);

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: role,
//       message: 'Role updated successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while updating role'
//     });
//   }
// };

// const deleteRole = async (req, res) => {
//   try {
//     const result = await schoolTeacherRoleService.deleteRole(req.params.id);

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: result,
//       message: 'Role deleted successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while deleting role'
//     });
//   }
// };

// const deleteRolesByTeacherId = async (req, res) => {
//   try {
//     const result = await schoolTeacherRoleService.deleteRolesByTeacherId(req.params.teacherId);

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: result,
//       message: 'Teacher roles deleted successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while deleting teacher roles'
//     });
//   }
// };

// module.exports = {
//   createRole,
//   getAllRoles,
//   getRoleById,
//   getRolesByTeacherId, 
//   getRolesByType,
//   getRolesByClassSection,
//   getClassTeacher,
//   getTeachersBySubject,
//   updateRole,
//   deleteRole,
//   deleteRolesByTeacherId
// };