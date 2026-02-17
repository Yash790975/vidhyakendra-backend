const StudentsMaster = require("../models/studentsMaster.model");
const StudentContactInformation = require("../models/studentContactInformation.model");
const Institute = require("../models/institutesMaster.model");
const ClassTeacherAssignments = require("../models/classTeacherAssignments.model");
const StudentAcademicMapping = require("../models/studentAcademicMapping.model");
const mongoose = require("mongoose");
  
const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");
    
// Generate student code: <INSTITUTE_ACRONYM>-<STUDENT_TYPE>-STD-<RUNNING_NUMBER>
const generateStudentCode = async (instituteId, studentType) => {
  // 1. Fetch institute name using institute_id
  const institute = await Institute.findById(instituteId);

  if (!institute) {   
    throw new CustomError(
      "Institute not found for student code generation",
      statusCode.NOT_FOUND
    );
  }

  const instituteName = institute.institute_name;

  // 2. Generate acronym from institute name
  const words = instituteName
    .toUpperCase()
    .replace(/[^A-Z\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  const acronym = words.map((w) => w[0]).join("");

  // 3. Get running number
  const count = await StudentsMaster.countDocuments({
    institute_id: instituteId,
    student_type: studentType,
  });

  const runningNumber = String(count + 1).padStart(3, "0");

  // 4. Format
  const typeCode = studentType === "school" ? "SCH" : "CCH";
  return `${acronym}-${typeCode}-STD-${runningNumber}`;
};

const createStudent = async (studentData) => {
  const studentCode = await generateStudentCode(
    studentData.institute_id,
    studentData.student_type
  );

  const student = new StudentsMaster({
    institute_id: new mongoose.Types.ObjectId(studentData.institute_id),
    student_code: studentCode,
    student_type: studentData.student_type,
    full_name: studentData.full_name,
    gender: studentData.gender,
    date_of_birth: new Date(studentData.date_of_birth),
    blood_group: studentData.blood_group || null,
    status: "active",
  });

  await student.save();
  return student;
};

const getAllStudents = async (filters = {}) => {
  const query = {};

  if (filters.institute_id) query.institute_id = filters.institute_id;
  if (filters.student_type) query.student_type = filters.student_type;
  if (filters.status) query.status = filters.status;

  const students = await StudentsMaster.find(query)
    .populate("institute_id", "institute_name institute_code")
    .sort({ createdAt: -1 });

  return students;
};

const getStudentById = async (studentId) => {
  const student = await StudentsMaster.findById(studentId).populate(
    "institute_id",
    "institute_name institute_code"
  );

  if (!student) {
    throw new CustomError("Student not found", statusCode.NOT_FOUND);
  }

  return student;
};

const getStudentByCode = async (studentCode) => {
  const student = await StudentsMaster.findOne({
    student_code: studentCode,
  }).populate("institute_id", "institute_name institute_code");

  if (!student) {
    throw new CustomError("Student not found", statusCode.NOT_FOUND);
  }

  return student;
};

const updateStudent = async (studentId, updateData) => {
  const student = await StudentsMaster.findById(studentId);

  if (!student) {
    throw new CustomError("Student not found", statusCode.NOT_FOUND);
  }

  // Handle archiving
  if (updateData.status === "archived" && student.status !== "archived") {
    updateData.archived_at = new Date();
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      student[key] = updateData[key];
    }
  });

  await student.save();
  return await StudentsMaster.findById(studentId).populate(
    "institute_id",
    "institute_name institute_code"
  );
};

const deleteStudent = async (studentId) => {
  const student = await StudentsMaster.findById(studentId);

  if (!student) {
    throw new CustomError("Student not found", statusCode.NOT_FOUND);
  }

  // Note: Add deletion of related records here when student-related collections are created
  // Example: StudentContactInformation, StudentAddresses, etc. 
  await Promise.all([
    StudentContactInformation.deleteMany({ student_id: studentId })
    // StudentAddresses.deleteMany({ student_id: studentId }),
    // ... other related collections
  ]); 

  await StudentsMaster.findByIdAndDelete(studentId);
  return student;
};

const getClassTeacherByStudentId = async (studentId, academicYear = null) => {
  // 1. Verify student exists
  const student = await StudentsMaster.findById(studentId);

  if (!student) {
    throw new CustomError("Student not found", statusCode.NOT_FOUND);
  }

  // 2. Find student's active academic mapping to get class and section
  const mappingQuery = {
    student_id: studentId,
    status: "active",
  };

  if (academicYear) {
    mappingQuery.academic_year = academicYear;
  }

  const studentMapping = await StudentAcademicMapping.findOne(mappingQuery)
    .populate("class_id", "class_name class_type class_level academic_year")
    .populate("section_id", "section_name")
    .sort({ createdAt: -1 });

  if (!studentMapping) {
    throw new CustomError(
      "Student is not enrolled in any class",
      statusCode.NOT_FOUND
    );
  }

  if (!studentMapping.class_id) {
    throw new CustomError(
      "Student's class information is missing",
      statusCode.NOT_FOUND
    );
  }

  // 3. Find the class teacher for that class/section
  const assignmentQuery = {
    class_id: studentMapping.class_id._id,
    role: "class_teacher",
    status: "active",
    academic_year: studentMapping.academic_year,
  };

  // Add section filter if student has a section
  if (studentMapping.section_id) {
    assignmentQuery.section_id = studentMapping.section_id._id;
  }

  const classTeacherAssignment = await ClassTeacherAssignments.findOne(
    assignmentQuery
  )
    .populate("teacher_id", "full_name teacher_code email phone_number")
    .populate("class_id", "class_name class_type class_level academic_year")
    .populate("section_id", "section_name");

  if (!classTeacherAssignment) {
    throw new CustomError(
      "No class teacher assigned for this student's class",
      statusCode.NOT_FOUND
    );
  }

  // 4. Return comprehensive information
  return {
    student: {
      _id: student._id,
      student_code: student.student_code,
      full_name: student.full_name,
      student_type: student.student_type,
    },
    enrollment: {
      class: studentMapping.class_id,
      section: studentMapping.section_id,
      academic_year: studentMapping.academic_year,
      roll_number: studentMapping.roll_number,
      mapping_type: studentMapping.mapping_type,
    },
    class_teacher: {
      assignment_id: classTeacherAssignment._id,
      teacher: classTeacherAssignment.teacher_id,
      class: classTeacherAssignment.class_id,
      section: classTeacherAssignment.section_id,
      role: classTeacherAssignment.role,
      academic_year: classTeacherAssignment.academic_year,
      assigned_from: classTeacherAssignment.assigned_from,
      assigned_to: classTeacherAssignment.assigned_to,
      status: classTeacherAssignment.status,
    },
  };
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  getStudentByCode,
  updateStudent,
  deleteStudent,
  getClassTeacherByStudentId,
};


















































































// const StudentsMaster = require("../models/studentsMaster.model");
// const StudentContactInformation = require("../models/studentContactInformation.model");
// const Institute = require("../models/institutesMaster.model");
// const mongoose = require("mongoose");
  
// const CustomError = require("../exceptions/CustomError");
// const statusCode = require("../enums/statusCode");
    
// // Generate student code: <INSTITUTE_ACRONYM>-<STUDENT_TYPE>-STD-<RUNNING_NUMBER>
// const generateStudentCode = async (instituteId, studentType) => {
//   // 1. Fetch institute name using institute_id
//   const institute = await Institute.findById(instituteId);

//   if (!institute) {   
//     throw new CustomError(
//       "Institute not found for student code generation",
//       statusCode.NOT_FOUND
//     );
//   }

//   const instituteName = institute.institute_name;

//   // 2. Generate acronym from institute name
//   const words = instituteName
//     .toUpperCase()
//     .replace(/[^A-Z\s]/g, "")
//     .split(/\s+/)
//     .filter(Boolean);

//   const acronym = words.map((w) => w[0]).join("");

//   // 3. Get running number
//   const count = await StudentsMaster.countDocuments({
//     institute_id: instituteId,
//     student_type: studentType,
//   });

//   const runningNumber = String(count + 1).padStart(3, "0");

//   // 4. Format
//   const typeCode = studentType === "school" ? "SCH" : "CCH";
//   return `${acronym}-${typeCode}-STD-${runningNumber}`;
// };

// const createStudent = async (studentData) => {
//   const studentCode = await generateStudentCode(
//     studentData.institute_id,
//     studentData.student_type
//   );

//   const student = new StudentsMaster({
//     institute_id: new mongoose.Types.ObjectId(studentData.institute_id),
//     student_code: studentCode,
//     student_type: studentData.student_type,
//     full_name: studentData.full_name,
//     gender: studentData.gender,
//     date_of_birth: new Date(studentData.date_of_birth),
//     blood_group: studentData.blood_group || null,
//     status: "active",
//   });

//   await student.save();
//   return student;
// };

// const getAllStudents = async (filters = {}) => {
//   const query = {};

//   if (filters.institute_id) query.institute_id = filters.institute_id;
//   if (filters.student_type) query.student_type = filters.student_type;
//   if (filters.status) query.status = filters.status;

//   const students = await StudentsMaster.find(query)
//     .populate("institute_id", "institute_name institute_code")
//     .sort({ createdAt: -1 });

//   return students;
// };

// const getStudentById = async (studentId) => {
//   const student = await StudentsMaster.findById(studentId).populate(
//     "institute_id",
//     "institute_name institute_code"
//   );

//   if (!student) {
//     throw new CustomError("Student not found", statusCode.NOT_FOUND);
//   }

//   return student;
// };

// const getStudentByCode = async (studentCode) => {
//   const student = await StudentsMaster.findOne({
//     student_code: studentCode,
//   }).populate("institute_id", "institute_name institute_code");

//   if (!student) {
//     throw new CustomError("Student not found", statusCode.NOT_FOUND);
//   }

//   return student;
// };

// const updateStudent = async (studentId, updateData) => {
//   const student = await StudentsMaster.findById(studentId);

//   if (!student) {
//     throw new CustomError("Student not found", statusCode.NOT_FOUND);
//   }

//   // Handle archiving
//   if (updateData.status === "archived" && student.status !== "archived") {
//     updateData.archived_at = new Date();
//   }

//   Object.keys(updateData).forEach((key) => {
//     if (updateData[key] !== undefined) {
//       student[key] = updateData[key];
//     }
//   });

//   await student.save();
//   return await StudentsMaster.findById(studentId).populate(
//     "institute_id",
//     "institute_name institute_code"
//   );
// };

// const deleteStudent = async (studentId) => {
//   const student = await StudentsMaster.findById(studentId);

//   if (!student) {
//     throw new CustomError("Student not found", statusCode.NOT_FOUND);
//   }

//   // Note: Add deletion of related records here when student-related collections are created
//   // Example: StudentContactInformation, StudentAddresses, etc. 
//   await Promise.all([
//     StudentContactInformation .deleteMany({ student_id: studentId })
//     // StudentAddresses.deleteMany({ student_id: studentId }),
//     // ... other related collections
//   ]); 

//   await StudentsMaster.findByIdAndDelete(studentId);
//   return student;
// };

// module.exports = {
//   createStudent,
//   getAllStudents,
//   getStudentById,
//   getStudentByCode,
//   updateStudent,
//   deleteStudent, 
// };