// // src/routes/schoolTeacherRole.routes.js
 
// const express = require('express');
// const router = express.Router();
// const schoolTeacherRoleController = require('../controllers/schoolTeacherRole.controller');

// // CRUD operations   
// router.post('/create', schoolTeacherRoleController.createRole); 
// router.get('/get-all', schoolTeacherRoleController.getAllRoles);
// router.get('/get/:id', schoolTeacherRoleController.getRoleById);
// router.put('/update/:id', schoolTeacherRoleController.updateRole);
// router.delete('/delete/:id', schoolTeacherRoleController.deleteRole);

// // Additional endpoints
// router.get('/get-by-teacher/:teacherId', schoolTeacherRoleController.getRolesByTeacherId);
// router.get('/get-by-role-type/:roleType', schoolTeacherRoleController.getRolesByType);
// router.get('/get-by-class-section', schoolTeacherRoleController.getRolesByClassSection);
// router.get('/get-class-teacher', schoolTeacherRoleController.getClassTeacher);
// router.get('/get-by-subject/:subject', schoolTeacherRoleController.getTeachersBySubject);
// router.delete('/delete-by-teacher/:teacherId', schoolTeacherRoleController.deleteRolesByTeacherId);

// module.exports = router;