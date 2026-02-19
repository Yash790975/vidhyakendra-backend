const ClassesMaster = require("../models/classesMaster.model");
const ClassSections = require("../models/classSections.model");
const mongoose = require("mongoose");
const TeacherMaster = require("../models/teachersMaster.model");

const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");
const InstituteMaster = require("../models/institutesMaster.model");

const createClass = async (classData) => {
  const institute = await InstituteMaster.findById(classData.institute_id, {
    institute_type: 1,
  });

  if (!institute) {
    throw new CustomError("Institute not found", statusCode.NOT_FOUND);
  }

  if (institute.institute_type === "school" && classData.class_type !== "school") {
    throw new CustomError(
      "For school institute, class type must be school",
      statusCode.BAD_REQUEST
    );
  }

  if (institute.institute_type === "coaching" && classData.class_type !== "coaching") {
    throw new CustomError(
      "For coaching institute, class type must be coaching",
      statusCode.BAD_REQUEST
    );
  }

  const classExists = await ClassesMaster.exists({
    institute_id: classData.institute_id,
    class_name: classData.class_name,
    status: "active",
  });

  if (classExists) {
    throw new CustomError(
      "Class with this name already exists for this institute",
      statusCode.CONFLICT
    );
  }

  if (classData.class_teacher_id) {
    const teacherExists = await TeacherMaster.exists({
      _id: classData.class_teacher_id,
    });

    if (!teacherExists) {
      throw new CustomError("Class teacher does not exist", statusCode.NOT_FOUND);
    }

    const teacherAlreadyAssigned = await ClassesMaster.exists({
      institute_id: classData.institute_id,
      class_teacher_id: classData.class_teacher_id,
      status: "active",
    });

    if (teacherAlreadyAssigned) {
      throw new CustomError(
        "This teacher is already assigned as a class teacher in this institute",
        statusCode.CONFLICT
      );
    }
  }

  const newClass = new ClassesMaster({
    institute_id: new mongoose.Types.ObjectId(classData.institute_id),
    class_name: classData.class_name,
    class_type: classData.class_type,
    class_teacher_id: classData.class_teacher_id
      ? new mongoose.Types.ObjectId(classData.class_teacher_id)
      : null,
    class_capacity: classData.class_capacity || null,
    class_level: classData.class_level || null,
    academic_year: classData.academic_year,
    status: "active",
  });

  await newClass.save();
  return newClass;
};

const getAllClasses = async (filters = {}) => {
  const query = {};

  if (filters.institute_id) query.institute_id = filters.institute_id;
  if (filters.class_type) query.class_type = filters.class_type;
  if (filters.status) query.status = filters.status;
  if (filters.academic_year) query.academic_year = filters.academic_year;
  if (filters.class_level) query.class_level = filters.class_level;

  const classes = await ClassesMaster.find(query)
    .populate("institute_id", "institute_name institute_code institute_type")
    .populate("class_teacher_id", "full_name teacher_code")
    .sort({ createdAt: -1 });

  return classes;
};

const getClassById = async (classId) => {
  const classData = await ClassesMaster.findById(classId)
    .populate("institute_id", "institute_name institute_code")
    .populate("class_teacher_id", "full_name teacher_code");

  if (!classData) {
    throw new CustomError("Class not found", statusCode.NOT_FOUND);
  }

  return classData;
};

const updateClass = async (classId, updateData) => {
  const classData = await ClassesMaster.findById(classId);

  if (!classData) {
    throw new CustomError("Class not found", statusCode.NOT_FOUND);
  }

  if (updateData.status === "archived" && classData.status !== "archived") {
    updateData.archived_at = new Date();
  }

  if (updateData.class_teacher_id) {
    updateData.class_teacher_id = new mongoose.Types.ObjectId(
      updateData.class_teacher_id
    );
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      classData[key] = updateData[key];
    }
  });

  await classData.save();
  return await ClassesMaster.findById(classId)
    .populate("institute_id", "institute_name institute_code")
    .populate("class_teacher_id", "full_name teacher_code");
};

const deleteClass = async (classId) => {
  const classData = await ClassesMaster.findById(classId);

  if (!classData) {
    throw new CustomError("Class not found", statusCode.NOT_FOUND);
  }

  const hasSections = await ClassSections.countDocuments({ class_id: classId });
  if (hasSections > 0) {
    throw new CustomError(
      "Cannot delete class with existing sections. Delete sections first.",
      statusCode.BAD_REQUEST
    );
  }

  await ClassesMaster.findByIdAndDelete(classId);
  return classData;
};

const getClassesByInstituteAndYear = async (instituteId, academicYear) => {
  const classes = await ClassesMaster.find({
    institute_id: instituteId,
    academic_year: academicYear,
    status: { $ne: "archived" },
  })
    .populate("class_teacher_id", "full_name teacher_code")
    .sort({ class_name: 1 });

  return classes;
};

module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  getClassesByInstituteAndYear,
};








































































































// const ClassesMaster = require("../models/classesMaster.model");
// const ClassSections = require("../models/classSections.model");
// const mongoose = require("mongoose");
// const TeacherMaster = require('../models/teachersMaster.model');

// const CustomError = require("../exceptions/CustomError");
// const statusCode = require("../enums/statusCode");
// const InstituteMaster = require('../models/institutesMaster.model');
   

// const createClass = async (classData) => {
//   const institute = await InstituteMaster.findById(
//     classData.institute_id, 
//     { institute_type: 1 }
//   );

//   if (!institute) {
//     throw new CustomError(
//       'Institute not found',
//       statusCode.NOT_FOUND
//     );
//   }

//   if (
//     institute.institute_type === 'school' &&
//     classData.class_type !== 'school'
//   ) {
//     throw new CustomError(
//       'For school institute, class type must be school',
//       statusCode.BAD_REQUEST
//     );
//   }

//   if (
//     institute.institute_type === 'coaching' &&
//     classData.class_type !== 'coaching'
//   ) {
//     throw new CustomError(
//       'For coaching institute, class type must be coaching',
//       statusCode.BAD_REQUEST
//     );
//   }

  
//      //Duplicate class check
  

//   const classExists = await ClassesMaster.exists({
//     institute_id: classData.institute_id,
//     class_name: classData.class_name,
//     status: 'active',
//   });

//   if (classExists) {
//     throw new CustomError(
//       'Class with this name already exists for this institute',
//       statusCode.CONFLICT
//     );
//   }

  
//      //Teacher validation
  

//   if (classData.class_teacher_id) {

//     const teacherExists = await TeacherMaster.exists({
//       _id: classData.class_teacher_id,
//     });

//     if (!teacherExists) {
//       throw new CustomError(
//         'Class teacher does not exist',
//         statusCode.NOT_FOUND
//       );
//     }

//     const teacherAlreadyAssigned = await ClassesMaster.exists({
//       institute_id: classData.institute_id,
//       class_teacher_id: classData.class_teacher_id,
//       status: 'active',
//     });

//     if (teacherAlreadyAssigned) {
//       throw new CustomError(
//         'This teacher is already assigned as a class teacher in this institute',
//         statusCode.CONFLICT
//       );
//     }
//   }

  
//      //Create class
  

//   const newClass = new ClassesMaster({
//     institute_id: new mongoose.Types.ObjectId(classData.institute_id),
//     class_name: classData.class_name,
//     class_type: classData.class_type,
//     class_teacher_id: classData.class_teacher_id
//       ? new mongoose.Types.ObjectId(classData.class_teacher_id)
//       : null,
//     class_level: classData.class_level || null,
//     academic_year: classData.academic_year,
//     status: 'active',
//   });

//   await newClass.save();
//   return newClass;
// };





// const getAllClasses = async (filters = {}) =>
//    {
//   const query = {};

//   if (filters.institute_id) query.institute_id = filters.institute_id;
//   if (filters.class_type) query.class_type = filters.class_type;
//   if (filters.status) query.status = filters.status;
//   if (filters.academic_year) query.academic_year = filters.academic_year;
//   if (filters.class_level) query.class_level = filters.class_level;

//   const classes = await ClassesMaster.find(query)
//     .populate("institute_id", "institute_name institute_code institute_type")
//     .populate("class_teacher_id", "full_name teacher_code")
//     .sort({ createdAt: -1 });

//   return classes;
// };

// const getClassById = async (classId) => {
//   const classData = await ClassesMaster.findById(classId)
//     .populate("institute_id", "institute_name institute_code")
//     .populate("class_teacher_id", "full_name teacher_code");

//   if (!classData) {
//     throw new CustomError("Class not found", statusCode.NOT_FOUND);
//   }

//   return classData;
// };

// const updateClass = async (classId, updateData) => {
//   const classData = await ClassesMaster.findById(classId);

//   if (!classData) {
//     throw new CustomError("Class not found", statusCode.NOT_FOUND);
//   }

//   // Handle archiving
//   if (updateData.status === "archived" && classData.status !== "archived") {
//     updateData.archived_at = new Date();
//   }

//   // Convert class_teacher_id to ObjectId if provided
//   if (updateData.class_teacher_id) {
//     updateData.class_teacher_id = new mongoose.Types.ObjectId(
//       updateData.class_teacher_id
//     );
//   }

//   Object.keys(updateData).forEach((key) => {
//     if (updateData[key] !== undefined) {
//       classData[key] = updateData[key];
//     }
//   });

//   await classData.save();
//   return await ClassesMaster.findById(classId)
//     .populate("institute_id", "institute_name institute_code")
//     .populate("class_teacher_id", "full_name teacher_code");
// };

// const deleteClass = async (classId) => {
//   const classData = await ClassesMaster.findById(classId);

//   if (!classData) {
//     throw new CustomError("Class not found", statusCode.NOT_FOUND);
//   }

//   // Check if class has sections
//   const hasSections = await ClassSections.countDocuments({ class_id: classId });
//   if (hasSections > 0) {
//     throw new CustomError(
//       "Cannot delete class with existing sections. Delete sections first.",
//       statusCode.BAD_REQUEST
//     );
//   }

//   await ClassesMaster.findByIdAndDelete(classId);
//   return classData;
// };

// // Get classes by institute and academic year
// const getClassesByInstituteAndYear = async (instituteId, academicYear) => {
//   const classes = await ClassesMaster.find({
//     institute_id: instituteId,
//     academic_year: academicYear,    
//     status: { $ne: "archived" },
//   })
//     .populate("class_teacher_id", "full_name teacher_code")
//     .sort({ class_name: 1 });

//   return classes;
// };

// module.exports = {
//   createClass,
//   getAllClasses,
//   getClassById,
//   updateClass,
//   deleteClass,
//   getClassesByInstituteAndYear,
// };