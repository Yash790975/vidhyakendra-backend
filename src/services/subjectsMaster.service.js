
const SubjectsMaster = require('../models/subjectsMaster.model');
const InstituteMaster = require('../models/institutesMaster.model');
const statusCode = require('../enums/statusCode');


const createSubject = async (data) => {

  /* ===============================
     Check institute & validate type
  =============================== */

  const institute = await InstituteMaster.findById(
    data.institute_id,
    { institute_type: 1 }
  );

  if (!institute) {
    const error = new Error('Institute not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  if (institute.institute_type !== data.subject_type) {
    const error = new Error(
      `Subject type must be "${institute.institute_type}" for this institute`
    );
    error.statusCode = statusCode.BAD_REQUEST;
    throw error;
  }

  /* ===============================
     Generate subject_code
  =============================== */

  const namePart = data.subject_name
    .substring(0, 4)
    .toUpperCase();

  const randomNumber = Math.floor(Math.random() * 900) + 100;

  data.subject_code = `${namePart}${randomNumber}`;

  /* ===============================
     Create subject
  =============================== */

  const subject = new SubjectsMaster(data);
  await subject.save();

  const populated = await SubjectsMaster.findById(subject._id)
    .populate(
      'institute_id',
      'institute_code institute_name institute_type'
    );

  return populated;
};


// const createSubject = async (data) => { 
//   // Check if institute exists
//   const institute = await InstituteMaster.findById(data.institute_id);
//   if (!institute) {
//     const error = new Error('Institute not found'); 
//     error.statusCode = statusCode.NOT_FOUND;
//     throw error;
//   }   

//   // Generate subject_code: first 4 letters of subject_name + 3 digit random number
//   const namePart = data.subject_name.substring(0, 4).toUpperCase();
//   const randomNumber = Math.floor(Math.random() * 900) + 100; // 100 to 999
//   data.subject_code = `${namePart}${randomNumber}`;

//   const subject = new SubjectsMaster(data);
//   await subject.save();
  
//   const populated = await SubjectsMaster.findById(subject._id)
//     .populate('institute_id', 'institute_code institute_name institute_type');
  
//   return populated;
// };

// Get all subjects
const getAllSubjects = async () => {
  const subjects = await SubjectsMaster.find()
    .populate('institute_id', 'institute_code institute_name institute_type')
    .sort({ subject_name: 1 });
  
  return subjects;
};

// Get subject by ID
const getSubjectById = async (id) => {
  const subject = await SubjectsMaster.findById(id)
    .populate('institute_id', 'institute_code institute_name institute_type');
  
  return subject;
};

// Get subjects by institute ID
const getSubjectsByInstituteId = async (instituteId) => {
  const subjects = await SubjectsMaster.find({ institute_id: instituteId })
    .populate('institute_id', 'institute_code institute_name institute_type')
    .sort({ subject_name: 1 });
  
  return subjects;
};

// Get subjects by type (school or coaching)
const getSubjectsByType = async (type) => {
  const subjects = await SubjectsMaster.find({ subject_type: type })
    .populate('institute_id', 'institute_code institute_name institute_type')
    .sort({ subject_name: 1 });
  
  return subjects;
};

// Get subjects by status
const getSubjectsByStatus = async (status) => {
  const subjects = await SubjectsMaster.find({ status })
    .populate('institute_id', 'institute_code institute_name institute_type')
    .sort({ subject_name: 1 });
  
  return subjects;
};

// Get subjects by class level
const getSubjectsByClassLevel = async (classLevel) => {
  const subjects = await SubjectsMaster.find({ class_levels: classLevel })
    .populate('institute_id', 'institute_code institute_name institute_type')
    .sort({ subject_name: 1 });
  
  return subjects;
};

// Get subjects by institute and type
const getSubjectsByInstituteAndType = async (instituteId, type) => {
  const subjects = await SubjectsMaster.find({ 
    institute_id: instituteId, 
    subject_type: type 
  })
    .populate('institute_id', 'institute_code institute_name institute_type')
    .sort({ subject_name: 1 });
  
  return subjects;
};

// Update subject
const updateSubject = async (id, data) => {
  const subject = await SubjectsMaster.findById(id);
  if (!subject) {
    const error = new Error('Subject not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  Object.assign(subject, data);
  await subject.save();

  const updated = await SubjectsMaster.findById(id)
    .populate('institute_id', 'institute_code institute_name institute_type');

  return updated;
};

// Delete subject
const deleteSubject = async (id) => {
  const subject = await SubjectsMaster.findByIdAndDelete(id);
  if (!subject) {
    const error = new Error('Subject not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  return { message: 'Subject deleted successfully' };
};

module.exports = {
  createSubject,
  getAllSubjects,
  getSubjectById,
  getSubjectsByInstituteId,
  getSubjectsByType,
  getSubjectsByStatus,
  getSubjectsByClassLevel,
  getSubjectsByInstituteAndType,
  updateSubject,
  deleteSubject
};

