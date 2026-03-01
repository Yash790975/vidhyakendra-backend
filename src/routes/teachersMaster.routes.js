const express = require("express");
const router = express.Router();
const teachersController = require("../controllers/teachersMaster.controller"); 

// ============= TEACHERS MASTER =============
router.post("/", teachersController.createTeacher);     
router.get("/", teachersController.getAllTeachers);
router.get("/teacher-with-all-details/:id", teachersController.getTeacherWithAllDetails);
router.get("/:id", teachersController.getTeacherById);
router.get("/code/:code", teachersController.getTeacherByCode);
router.put("/:id", teachersController.updateTeacher);
router.put("/update-with-all-details/:id", teachersController.updateTeacherWithAllDetails);
router.delete("/:id", teachersController.deleteTeacher);
 
       
module.exports = router;














// const express = require("express");
// const router = express.Router();
// const teachersController = require("../controllers/teachersMaster.controller"); 

// // ============= TEACHERS MASTER =============
// router.post("/", teachersController.createTeacher);
// router.get("/", teachersController.getAllTeachers);
// router.get("/:id", teachersController.getTeacherById);
// router.get("/code/:code", teachersController.getTeacherByCode);
// router.put("/:id", teachersController.updateTeacher);
// router.delete("/:id", teachersController.deleteTeacher);
// router.get("/teacher-with-all-details/:id", teachersController.getTeacherWithAllDetails);
 
       
// module.exports = router;    