const teachersService = require("../services/teachersMaster.service");
const statusCode = require("../enums/statusCode"); 
const {    
  createTeacherValidation, 
  updateTeacherValidation,   
} = require("../validations/teachersMaster.validations"); 
const path = require("path");
const fs = require("fs");
const { UPLOADS_ROOT } = require("../middlewares/upload");


// ============= TEACHERS MASTER =============

const getTeacherWithAllDetails = async (req, res) => {
  try {
    const teacher = await teachersService.getTeacherWithAllDetails(req.params.id);
    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: teacher,
      message: "Teacher details retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve teacher details",
    });
  }
};


const createTeacher = async (req, res) => {
  try {
    const { error, value } = createTeacherValidation.validate(req.body);
    if (error) {
      // Clean up uploaded photo if validation fails
      if (req.file) {
        const filePath = path.join(UPLOADS_ROOT, "teacher_photos", req.file.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {}, 
        message: error.details[0].message,
      });
    }

    const photoUrl = req.file
      ? `/uploads/teacher_photos/${req.file.filename}`
      : null;

    const teacher = await teachersService.createTeacher(value, photoUrl);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: teacher,
      message: "Teacher created successfully",
    });
  } catch (err) {
    // Clean up uploaded photo on error
    if (req.file) {
      const filePath = path.join(UPLOADS_ROOT, "teacher_photos", req.file.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to create teacher",
    });
  }
};

const getAllTeachers = async (req, res) => {
  try {
    const filters = {
      institute_id: req.query.institute_id,
      teacher_type: req.query.teacher_type,
      status: req.query.status,
      employment_type: req.query.employment_type,
    };

    const teachers = await teachersService.getAllTeachers(filters);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: teachers,
      message: "Teachers retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve teachers",
    });
  }
};

const getTeacherById = async (req, res) => {
  try {
    const teacher = await teachersService.getTeacherById(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: teacher,
      message: "Teacher retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve teacher",
    });
  }
};

const getTeacherByCode = async (req, res) => {
  try {
    const teacher = await teachersService.getTeacherByCode(req.params.code);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: teacher,
      message: "Teacher retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve teacher",
    });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const { error, value } = updateTeacherValidation.validate(req.body);
    if (error) {
      // Clean up uploaded photo if validation fails
      if (req.file) {
        const filePath = path.join(UPLOADS_ROOT, "teacher_photos", req.file.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {}, 
        message: error.details[0].message,
      });
    }

    const newPhotoUrl = req.file
      ? `/uploads/teacher_photos/${req.file.filename}`
      : null;

    const teacher = await teachersService.updateTeacher(req.params.id, value, newPhotoUrl);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: teacher,
      message: "Teacher updated successfully",
    });
  } catch (err) {
    // Clean up uploaded photo on error
    if (req.file) {
      const filePath = path.join(UPLOADS_ROOT, "teacher_photos", req.file.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to update teacher",
    });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const teacher = await teachersService.deleteTeacher(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: teacher,
      message: "Teacher deleted successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to delete teacher",
    });
  }
};

const updateTeacherWithAllDetails = async (req, res) => {
  try {
    const teacher = await teachersService.updateTeacherWithAllDetails(
      req.params.id,
      req.body
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: teacher,
      message: "Teacher details updated successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to update teacher details",
    });
  }
};

module.exports = {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  getTeacherByCode,
  updateTeacher,
  updateTeacherWithAllDetails,
  deleteTeacher,
  getTeacherWithAllDetails,
};




























































// const teachersService = require("../services/teachersMaster.service");
// const statusCode = require("../enums/statusCode"); 
// const {    
//   createTeacherValidation, 
//   updateTeacherValidation,   
// } = require("../validations/teachersMaster.validations"); 
    
// // ============= TEACHERS MASTER =============


// const getTeacherWithAllDetails = async (req, res) => {
//   try {
//     const teacher = await teachersService.getTeacherWithAllDetails(req.params.id);
//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: teacher,
//       message: "Teacher details retrieved successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to retrieve teacher details",
//     });
//   }
// };



// const createTeacher = async (req, res) => {
//   try {
//     const { error, value } = createTeacherValidation.validate(req.body);
//     if (error) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: {}, 
//         message: error.details[0].message,
//       });
//     }

//     const teacher = await teachersService.createTeacher(value);

//     res.status(statusCode.CREATED).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.CREATED,
//       result: teacher,
//       message: "Teacher created successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to create teacher",
//     });
//   }
// };

// const getAllTeachers = async (req, res) => {
//   try {
//     const filters = {
//       institute_id: req.query.institute_id,
//       teacher_type: req.query.teacher_type,
//       status: req.query.status,
//       employment_type: req.query.employment_type,
//     };

//     const teachers = await teachersService.getAllTeachers(filters);

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: teachers,
//       message: "Teachers retrieved successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to retrieve teachers",
//     });
//   }
// };

// const getTeacherById = async (req, res) => {
//   try {
//     const teacher = await teachersService.getTeacherById(req.params.id);

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: teacher,
//       message: "Teacher retrieved successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to retrieve teacher",
//     });
//   }
// };

// const getTeacherByCode = async (req, res) => {
//   try {
//     const teacher = await teachersService.getTeacherByCode(req.params.code);

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: teacher,
//       message: "Teacher retrieved successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to retrieve teacher",
//     });
//   }
// };

// const updateTeacher = async (req, res) => {
//   try {
//     const { error, value } = updateTeacherValidation.validate(req.body);
//     if (error) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: {}, 
//         message: error.details[0].message,
//       });
//     }

//     const teacher = await teachersService.updateTeacher(req.params.id, value);

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: teacher,
//       message: "Teacher updated successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to update teacher",
//     });
//   }
// };

// const deleteTeacher = async (req, res) => {
//   try {
//     const teacher = await teachersService.deleteTeacher(req.params.id);

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: teacher,
//       message: "Teacher deleted successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to delete teacher",
//     });
//   }
// };

// const updateTeacherWithAllDetails = async (req, res) => {
//   try {
//     const teacher = await teachersService.updateTeacherWithAllDetails(
//       req.params.id,
//       req.body
//     );

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: teacher,
//       message: "Teacher details updated successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to update teacher details",
//     });
//   }
// };

// module.exports = {
//   // Teachers Master
//   createTeacher,
//   getAllTeachers,
//   getTeacherById,
//   getTeacherByCode,
//   updateTeacher,
//   updateTeacherWithAllDetails, // Add this line
//   deleteTeacher,
//   getTeacherWithAllDetails
// };
  