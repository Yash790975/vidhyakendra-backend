const ClassSubjects = require("../models/classSubjects.model");
const ClassesMaster = require("../models/classesMaster.model");
const SubjectsMaster = require("../models/subjectsMaster.model");
const mongoose = require("mongoose");

const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");

const createClassSubject = async (classSubjectData) => {

    // Check duplicate class-subject
  

  const existing = await ClassSubjects.findOne({
    class_id: classSubjectData.class_id,
    subject_id: classSubjectData.subject_id,
  });

  if (existing) {
    throw new CustomError(
      "This subject is already assigned to this class",
      statusCode.CONFLICT
    );
  }

  
    // Fetch class & subject

  const [classDoc, subjectDoc] = await Promise.all([
    ClassesMaster.findById(
      classSubjectData.class_id,
      { class_type: 1 }
    ),
    SubjectsMaster.findById(
      classSubjectData.subject_id,
      { subject_type: 1 }
    ),
  ]);

  if (!classDoc) {
    throw new CustomError(
      "Class not found",
      statusCode.NOT_FOUND
    );
  }

  if (!subjectDoc) {
    throw new CustomError(
      "Subject not found",
      statusCode.NOT_FOUND
    );
  }



  if (classDoc.class_type !== subjectDoc.subject_type) {
    throw new CustomError(
      `Class type (${classDoc.class_type}) and subject type (${subjectDoc.subject_type}) both are different, both must be same`,
      statusCode.BAD_REQUEST
    );
  }


//     Create class-subject


  const classSubject = new ClassSubjects({
    class_id: new mongoose.Types.ObjectId(classSubjectData.class_id),
    subject_id: new mongoose.Types.ObjectId(classSubjectData.subject_id),
    is_compulsory: classSubjectData.is_compulsory,
  });

  await classSubject.save();
  return classSubject;
};


const getAllClassSubjects = async (filters = {}) => {
  const query = {};

  if (filters.class_id) query.class_id = filters.class_id;
  if (filters.subject_id) query.subject_id = filters.subject_id;
  if (filters.is_compulsory !== undefined)
    query.is_compulsory = filters.is_compulsory;

  const classSubjects = await ClassSubjects.find(query)
    .populate("class_id", "class_name class_type academic_year")
    .populate("subject_id", "subject_name subject_code subject_type")
    .sort({ createdAt: -1 });

  return classSubjects;
};

const getClassSubjectById = async (classSubjectId) => {
  const classSubject = await ClassSubjects.findById(classSubjectId)
    .populate("class_id", "class_name class_type academic_year")
    .populate("subject_id", "subject_name subject_code");

  if (!classSubject) {
    throw new CustomError("Class subject not found", statusCode.NOT_FOUND);
  }

  return classSubject;
};

const getSubjectsByClassId = async (classId) => {
  const classSubjects = await ClassSubjects.find({ class_id: classId })
    .populate("subject_id", "subject_name subject_code")
    .sort({ is_compulsory: -1 });

  return classSubjects;
};

const updateClassSubject = async (classSubjectId, updateData) => {
  const classSubject = await ClassSubjects.findById(classSubjectId);

  if (!classSubject) {
    throw new CustomError("Class subject not found", statusCode.NOT_FOUND);
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      classSubject[key] = updateData[key];
    }
  });

  await classSubject.save();
  return await ClassSubjects.findById(classSubjectId)
    .populate("class_id", "class_name class_type academic_year")
    .populate("subject_id", "subject_name subject_code");
};

const deleteClassSubject = async (classSubjectId) => {
  const classSubject = await ClassSubjects.findById(classSubjectId);

  if (!classSubject) {
    throw new CustomError("Class subject not found", statusCode.NOT_FOUND);
  }

  await ClassSubjects.findByIdAndDelete(classSubjectId);
  return classSubject;
};

// Bulk assign subjects to a class
const bulkAssignSubjects = async (classId, subjectIds, isCompulsory = true) => {
  const classSubjects = subjectIds.map((subjectId) => ({
    class_id: new mongoose.Types.ObjectId(classId),
    subject_id: new mongoose.Types.ObjectId(subjectId),
    is_compulsory: isCompulsory,
  }));

  const result = await ClassSubjects.insertMany(classSubjects, {
    ordered: false,
  });
  return result;
};

module.exports = {
  createClassSubject,
  getAllClassSubjects,
  getClassSubjectById,
  getSubjectsByClassId,
  updateClassSubject,
  deleteClassSubject,
  bulkAssignSubjects,
};