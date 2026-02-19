const ClassSections = require("../models/classSections.model");
const ClassesMaster = require("../models/classesMaster.model");
const mongoose = require("mongoose");

const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");


const createSection = async (sectionData) => {

  /* 1️⃣ Check if class exists */
  const classExists = await ClassesMaster.findById(sectionData.class_id);
  if (!classExists) {
    throw new CustomError("Class not found", statusCode.NOT_FOUND);
  }

  /* 2️⃣ Ensure class has no class teacher */
  if (classExists.class_teacher_id) {
    throw new CustomError(
      "Cannot create section. Class already has a class teacher assigned. Remove class teacher from class first.",
      statusCode.BAD_REQUEST
    );
  } 

  /* 3️⃣ Check if teacher already class teacher of ANY section in same institute */
  const teacherAlreadyAssigned = await ClassSections.findOne({
    class_teacher_id: sectionData.class_teacher_id,
    status: "active",
  }).populate({
    path: "class_id",
    match: { institute_id: classExists.institute_id },
    select: "_id",
  });

  if (teacherAlreadyAssigned && teacherAlreadyAssigned.class_id) {
    throw new CustomError(
      "This teacher is already assigned as a class teacher for another section in this institute",
      statusCode.BAD_REQUEST
    );
  }

  // Check if teacher is already assigned as class teacher for even any other class or class section using ClassesMaster and ClassSections collections.
  const existingClassTeacher = await ClassesMaster.findOne({
    class_teacher_id: sectionData.class_teacher_id,
  });

  if (existingClassTeacher) {
    throw new CustomError(
      "This teacher is already assigned as a class teacher for another class",
      statusCode.BAD_REQUEST
    );
  }

  /* 4️⃣ Create section */
  const section = new ClassSections({
    class_id: new mongoose.Types.ObjectId(sectionData.class_id),
    section_name: sectionData.section_name,
    class_teacher_id: new mongoose.Types.ObjectId(sectionData.class_teacher_id),
    status: "active",
  });

  await section.save();
  return section;
};

// const createSection = async (sectionData) => {
//   // Check if class exists
//   const classExists = await ClassesMaster.findById(sectionData.class_id);
//   if (!classExists) {
//     throw new CustomError("Class not found", statusCode.NOT_FOUND);
//   }

//   // When creating a section, ensure the class has no class_teacher_id
//   if (classExists.class_teacher_id) {
//     throw new CustomError(
//       "Cannot create section. Class already has a class teacher assigned. Remove class teacher from class first.",
//       statusCode.BAD_REQUEST
//     );
//   }

//   const section = new ClassSections({
//     class_id: new mongoose.Types.ObjectId(sectionData.class_id),
//     section_name: sectionData.section_name,
//     class_teacher_id: new mongoose.Types.ObjectId(sectionData.class_teacher_id),
//     status: "active",
//   });

//   await section.save();
//   return section;
// };

const getAllSections = async (filters = {}) => {
  const query = {};

  if (filters.class_id) query.class_id = filters.class_id;
  if (filters.status) query.status = filters.status;

  const sections = await ClassSections.find(query)
    .populate("class_id", "class_name class_type academic_year")
    .populate("class_teacher_id", "full_name teacher_code")
    .sort({ createdAt: -1 });

  return sections;
};

const getSectionById = async (sectionId) => {
  const section = await ClassSections.findById(sectionId)
    .populate("class_id", "class_name class_type academic_year")
    .populate("class_teacher_id", "full_name teacher_code");

  if (!section) {
    throw new CustomError("Section not found", statusCode.NOT_FOUND);
  }

  return section;
};

const getSectionsByClassId = async (classId) => {
  const sections = await ClassSections.find({ class_id: classId })
    .populate("class_teacher_id", "full_name teacher_code")
    .sort({ section_name: 1 });

  return sections;
};

const updateSection = async (sectionId, updateData) => {
  const section = await ClassSections.findById(sectionId);

  if (!section) {
    throw new CustomError("Section not found", statusCode.NOT_FOUND);
  }

  // Handle archiving
  if (updateData.status === "archived" && section.status !== "archived") {
    updateData.archived_at = new Date();
  }

  // Convert class_teacher_id to ObjectId if provided
  if (updateData.class_teacher_id) {
    updateData.class_teacher_id = new mongoose.Types.ObjectId(
      updateData.class_teacher_id
    );
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      section[key] = updateData[key];
    }
  });

  await section.save();
  return await ClassSections.findById(sectionId)
    .populate("class_id", "class_name class_type academic_year")
    .populate("class_teacher_id", "full_name teacher_code");
};
 
const deleteSection = async (sectionId) => {
  const section = await ClassSections.findById(sectionId);

  if (!section) {
    throw new CustomError("Section not found", statusCode.NOT_FOUND);
  }

  await ClassSections.findByIdAndDelete(sectionId);
  return section;
};

module.exports = {
  createSection,
  getAllSections,
  getSectionById,
  getSectionsByClassId,
  updateSection,
  deleteSection,
};