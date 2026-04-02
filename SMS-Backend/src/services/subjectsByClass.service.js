const SubjectsByClass = require('../models/subjectsByClass.model');
const SubjectsMaster = require('../models/subjectsMaster.model');
const InstituteMaster = require('../models/institutesMaster.model'); 
const ClassesMaster = require('../models/classesMaster.model');
// const ClassesSectionsMaster = require('../models/classesSectionsMaster.model');
const ClassesSectionsMaster = require('../models/classSections.model');
const statusCode = require('../enums/statusCode');
const { generateSubjectCode } = require('./subjectsMaster.service');

/* ─────────────────────────────────────────────────────────────────
   Helper: build class-wise subject code
   Format: <subject_code>-<class_level><section_name>
   e.g.  MATH-1A  |  MATH-1  (when no section)
───────────────────────────────────────────────────────────────── */
const buildClassSubjectCode = (baseCode, classLevel, sectionName) => {
  const section = sectionName ? sectionName.toUpperCase() : '';
  return `${baseCode}-${classLevel}${section}`;
};

/* ─────────────────────────────────────────────────────────────────
   Populate helper — reused in every query
───────────────────────────────────────────────────────────────── */
const populateRecord = (query) =>
  query
    .populate('institute_id', 'institute_code institute_name institute_type')
    .populate('class_id', 'class_name class_level')
    .populate('section_id', 'section_name')
    .populate('subject_id', 'subject_code subject_name subject_type');

/* ═══════════════════════════════════════════════════════════════
   CREATE
═══════════════════════════════════════════════════════════════ */
const createSubjectByClass = async (data) => {
  const { institute_id, class_id, section_id, subject_name, subject_type, status } = data;

  /* ── 1. Validate institute ── */
  const institute = await InstituteMaster.findById(institute_id, { institute_type: 1 });
  if (!institute) {
    const err = new Error('Institute not found');
    err.statusCode = statusCode.NOT_FOUND;
    throw err;
  }

  /* ── 2. Validate class ── */
  const classDoc = await ClassesMaster.findById(class_id, { class_name: 1, class_level: 1 });
  if (!classDoc) {
    const err = new Error('Class not found');
    err.statusCode = statusCode.NOT_FOUND;
    throw err;
  }

  /* ── 3. Validate section (optional) ── */
  let sectionDoc = null;
  if (section_id) {
    sectionDoc = await ClassesSectionsMaster.findById(section_id, { section_name: 1 });
    if (!sectionDoc) {
      const err = new Error('Section not found');
      err.statusCode = statusCode.NOT_FOUND;
      throw err;
    }
  }

  /* ── 4. Find or create subject in subjects_master ── */
  let subject = await SubjectsMaster.findOne({
    institute_id,
    subject_name: { $regex: new RegExp(`^${subject_name.trim()}$`, 'i') }
  });

  if (!subject) {
    // Create new master subject
    const masterSubjectType = institute.institute_type; // 'school' | 'coaching'
    const newSubjectCode = generateSubjectCode(subject_name);

    subject = new SubjectsMaster({
      institute_id,
      subject_name: subject_name.trim(),
      subject_code: newSubjectCode,
      subject_type: masterSubjectType,
      status: 'active'
    });

    try {
      await subject.save();
    } catch (err) {
      if (err.code === 11000) {
        // Race condition — another request just created it; fetch it
        subject = await SubjectsMaster.findOne({ institute_id, subject_name: subject_name.trim() });
      } else {
        throw err;
      }
    }
  }

  /* ── 5. Build class-wise subject_code ── */
  const classLevel = classDoc.class_level || classDoc.class_name;
  const sectionName = sectionDoc ? sectionDoc.section_name : '';
  const classSubjectCode = buildClassSubjectCode(subject.subject_code, classLevel, sectionName);

  /* ── 6. Create subjects_by_class record ── */
  try {
    const record = new SubjectsByClass({
      institute_id,
      class_id,
      section_id: section_id || null,
      subject_id: subject._id,
      subject_code: classSubjectCode,
      subject_type,
      status: status || 'active'
    });

    await record.save();

    return await populateRecord(SubjectsByClass.findById(record._id));
  } catch (err) {
    if (err.code === 11000) {
      const dupErr = new Error(
        'This subject is already assigned to the given class/section for this institute'
      );
      dupErr.statusCode = statusCode.CONFLICT || 409;
      throw dupErr;
    }
    throw err;
  }
};

/* ═══════════════════════════════════════════════════════════════
   READ
═══════════════════════════════════════════════════════════════ */

// Get all
const getAllSubjectsByClass = async () =>
  populateRecord(SubjectsByClass.find().sort({ created_at: -1 }));

// Get by ID
const getSubjectByClassId = async (id) =>
  populateRecord(SubjectsByClass.findById(id));

// Get by institute
const getSubjectsByClassInstituteId = async (instituteId) =>
  populateRecord(
    SubjectsByClass.find({ institute_id: instituteId }).sort({ created_at: -1 })
  );

// Get by class
const getSubjectsByClassId = async (classId) =>
  populateRecord(
    SubjectsByClass.find({ class_id: classId }).sort({ created_at: -1 })
  );

// Get by institute + class
const getSubjectsByInstituteAndClass = async (instituteId, classId) =>
  populateRecord(
    SubjectsByClass.find({ institute_id: instituteId, class_id: classId }).sort({ created_at: -1 })
  );

// Get by institute + class + section
const getSubjectsByInstituteClassAndSection = async (instituteId, classId, sectionId) =>
  populateRecord(
    SubjectsByClass.find({
      institute_id: instituteId,
      class_id: classId,
      section_id: sectionId
    }).sort({ created_at: -1 })
  );

// Get by status
const getSubjectsByClassStatus = async (status) =>
  populateRecord(
    SubjectsByClass.find({ status }).sort({ created_at: -1 })
  );

// Get by subject_type (theory / practical / both)
const getSubjectsByClassType = async (subjectType) =>
  populateRecord(
    SubjectsByClass.find({ subject_type: subjectType }).sort({ created_at: -1 })
  );

/* ═══════════════════════════════════════════════════════════════
   UPDATE
═══════════════════════════════════════════════════════════════ */
const updateSubjectByClass = async (id, data) => {
  const record = await SubjectsByClass.findById(id);
  if (!record) {
    const err = new Error('Subject by class record not found');
    err.statusCode = statusCode.NOT_FOUND;
    throw err;
  }

  Object.assign(record, data);
  await record.save();

  return populateRecord(SubjectsByClass.findById(id));
};

/* ═══════════════════════════════════════════════════════════════
   DELETE
═══════════════════════════════════════════════════════════════ */
const deleteSubjectByClass = async (id) => {
  const record = await SubjectsByClass.findByIdAndDelete(id);
  if (!record) {
    const err = new Error('Subject by class record not found');
    err.statusCode = statusCode.NOT_FOUND;
    throw err;
  }
  return { message: 'Subject by class record deleted successfully' };
};

module.exports = {
  createSubjectByClass,
  getAllSubjectsByClass,
  getSubjectByClassId,
  getSubjectsByClassInstituteId,
  getSubjectsByClassId,
  getSubjectsByInstituteAndClass,
  getSubjectsByInstituteClassAndSection,
  getSubjectsByClassStatus,
  getSubjectsByClassType,
  updateSubjectByClass,
  deleteSubjectByClass
};
