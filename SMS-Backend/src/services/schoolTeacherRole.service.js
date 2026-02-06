// // src/services/schoolTeacherRole.service.js

// const SchoolTeacherRole = require('../models/schoolTeacherRole.model');
// const Teacher = require('../models/teachersMaster.model');
// const statusCode = require('../enums/statusCode');
 
// // Create school teacher role 
// const createRole = async (data) => {
//   // Check if teacher exists
//   const teacher = await Teacher.findById(data.teacher_id);
//   if (!teacher) {
//     const error = new Error('Teacher not found');
//     error.statusCode = statusCode.NOT_FOUND;
//     throw error;
//   }

//   // Create role
//   const role = new SchoolTeacherRole(data);
//   await role.save();

//   // Populate teacher details
//   const populatedRole = await SchoolTeacherRole.findById(role._id)
//     .populate('teacher_id', 'name employee_code email mobile');

//   return populatedRole;
// };

// // Get all roles
// const getAllRoles = async () => {
//   const roles = await SchoolTeacherRole.find()
//     // .populate('teacher_id', 'name employee_code email mobile');
//     .populate("teacher_id", "full_name teacher_code")
  
//   return roles;
// };

// // Get role by ID
// const getRoleById = async (id) => {
//   const role = await SchoolTeacherRole.findById(id)
//     // .populate('teacher_id', 'name employee_code email mobile');
//     .populate("teacher_id", "full_name teacher_code")
  
//   return role;
// };

// // Get roles by teacher ID
// const getRolesByTeacherId = async (teacherId) => {
//   const roles = await SchoolTeacherRole.find({ teacher_id: teacherId })
//     // .populate('teacher_id', 'name employee_code email mobile');
//     .populate("teacher_id", "full_name teacher_code")
  
//   return roles;
// };

// // Get roles by role type
// const getRolesByType = async (roleType) => {
//   const roles = await SchoolTeacherRole.find({ role_type: roleType })
//     // .populate('teacher_id', 'name employee_code email mobile');
//     .populate("teacher_id", "full_name teacher_code")
  
//   return roles;
// };

// // Get roles by class and section
// const getRolesByClassSection = async (assignedClass, assignedSection) => {
//   const query = {};
//   if (assignedClass) query.assigned_class = assignedClass;
//   if (assignedSection) query.assigned_section = assignedSection;

//   const roles = await SchoolTeacherRole.find(query)
//     // .populate('teacher_id', 'name employee_code email mobile');
//     .populate("teacher_id", "full_name teacher_code")
  
//   return roles;
// };

// // Get class teacher for a specific class and section
// const getClassTeacher = async (assignedClass, assignedSection) => {
//   const classTeacher = await SchoolTeacherRole.findOne({
//     role_type: 'class_teacher',
//     assigned_class: assignedClass,
//     assigned_section: assignedSection
//   })
//   // .populate('teacher_id', 'name employee_code email mobile');
//   .populate("teacher_id", "full_name teacher_code")
  
//   return classTeacher;
// };

// // Get subject teachers by subject
// const getTeachersBySubject = async (subject) => {
//   const teachers = await SchoolTeacherRole.find({
//     subjects: subject
//   })
//   .populate("teacher_id", "full_name teacher_code")
  
//   return teachers;
// };

// // Update role
// const updateRole = async (id, data) => {
//   const role = await SchoolTeacherRole.findById(id);
//   if (!role) {
//     const error = new Error('Role not found');
//     error.statusCode = statusCode.NOT_FOUND;
//     throw error;
//   }

//   Object.assign(role, data);
//   await role.save();

//   const updatedRole = await SchoolTeacherRole.findById(id)
//     .populate("teacher_id", "full_name teacher_code")

//   return updatedRole;
// };

// // Delete role
// const deleteRole = async (id) => {
//   const role = await SchoolTeacherRole.findByIdAndDelete(id);
//   if (!role) {
//     const error = new Error('Role not found');
//     error.statusCode = statusCode.NOT_FOUND;
//     throw error;
//   }

//   return { message: 'Role deleted successfully' };
// };

// // Delete all roles for a teacher
// const deleteRolesByTeacherId = async (teacherId) => {
//   const result = await SchoolTeacherRole.deleteMany({ teacher_id: teacherId });
  
//   return { 
//     message: 'Teacher roles deleted successfully',
//     deletedCount: result.deletedCount
//   };
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