const TeachersMaster = require("../models/teachersMaster.model"); 
const TeacherContactInformation = require("../models/teacherContactInformation.model");
const TeacherAddresses = require("../models/teacherAddresses.model");
const TeacherIdentityDocuments = require("../models/teacherIdentityDocuments.model");
const TeacherQualificationDetails = require("../models/teacherQualificationDetails.model");
const TeacherExperience = require("../models/teacherExperience.model");
const TeacherBankDetails = require("../models/teacherBankDetails.model");
const TeacherEmergencyContacts = require("../models/teacherEmergencyContacts.model"); 
const TeacherAuth = require("../models/teacherAuth.model");
const TeacherSalaryStructure = require("../models/teacherSalaryStructure.model");
const TeacherSalaryTransactions = require("../models/teacherSalaryTransactions.model");
const TeacherAttendance = require("../models/teacherAttendance.model");
const TeacherLeaves = require("../models/teacherLeaves.model");
const ClassSubjectSchedule = require("../models/classSubjectSchedule.model");
// const TeacherSubjets = require("../models/teacherSubjects.model");
const Institute = require("../models/institutesMaster.model");
 
const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");
const fs = require("fs");
const path = require("path");  
 

// Generate teacher code: <INSTITUTE_ACRONYM>-<TEACHER_TYPE>-TCH-<RUNNING_NUMBER>
const generateTeacherCode = async (instituteId, teacherType) => {
  // 1. Fetch institute name using institute_id
  const institute = await Institute.findById(instituteId);

  if (!institute) {
    throw new CustomError("Institute not found for teacher code generation", statusCode.NOT_FOUND);
  }

  const instituteName = institute.institute_name; // assuming field is "name"

  // 2. Generate acronym from institute name
  const words = instituteName
    .toUpperCase()
    .replace(/[^A-Z\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  const acronym = words.map(w => w[0]).join("");

  // 3. Get running number
  const count = await TeachersMaster.countDocuments({
    institute_id: instituteId,
    teacher_type: teacherType,
  });

  const runningNumber = String(count + 1).padStart(3, "0");

  // 4. Format
  const typeCode = teacherType === "school" ? "SCH" : "CCH";
  return `${acronym}-${typeCode}-TCH-${runningNumber}`;
};



const mongoose = require("mongoose");


// getTeacherWithAllDetails
const getTeacherWithAllDetails = async (teacherId) => {
  // Fetch teacher master details
  const teacher = await TeachersMaster.findById(teacherId).populate(
    "institute_id",
    "institute_name institute_code institute_type"
  );

  if (!teacher) {
    throw new CustomError("Teacher not found", statusCode.NOT_FOUND);
  }

  // Fetch all related information in parallel
  const [
    contactInfo,
    addresses,
    identityDocuments,
    qualifications,
    experience,
    bankDetails,
    emergencyContacts,
    salaryStructure,
    salaryTransactions,
    attendance,
    leaves,
    classSubjectSchedule,
    // teacherSubjects,
  ] = await Promise.all([
    TeacherContactInformation.find({ teacher_id: teacherId }),
    TeacherAddresses.find({ teacher_id: teacherId }),
    TeacherIdentityDocuments.find({ teacher_id: teacherId }),
    TeacherQualificationDetails.find({ teacher_id: teacherId }),
    TeacherExperience.find({ teacher_id: teacherId }),
    TeacherBankDetails.find({ teacher_id: teacherId }),
    TeacherEmergencyContacts.find({ teacher_id: teacherId }),
    TeacherSalaryStructure.find({ teacher_id: teacherId }),
    TeacherSalaryTransactions.find({ teacher_id: teacherId }).sort({ transaction_date: -1 }),
    TeacherAttendance.find({ teacher_id: teacherId }).sort({ attendance_date: -1 }),
    TeacherLeaves.find({ teacher_id: teacherId }).sort({ start_date: -1 }),
    ClassSubjectSchedule.find({ teacher_id: teacherId }).populate("class_id section_id subject_id"),
    // TeacherSubjets.find({ teacher_id: teacherId }).populate("subject_id"),
  ]);

  // Compile all data into a single object
  return {
    teacher: teacher.toObject(),
    contact_information: contactInfo,
    addresses: addresses,
    identity_documents: identityDocuments,
    qualifications: qualifications,
    experience: experience,
    bank_details: bankDetails,
    emergency_contacts: emergencyContacts,
    salary_structure: salaryStructure,
    salary_transactions: salaryTransactions,
    attendance: attendance,
    leaves: leaves,
    class_subject_schedule: classSubjectSchedule,
    // teacher_subjects: teacherSubjects,
  };
};
 
//also crete one more function 'updateTeacherWithAllDetails' to update teacher limite details along with this related info populated including( contact info, address, emergency contacts). please create that function below, so that i can update this details in one function.
const updateTeacherWithAllDetails = async (teacherId, updateData) => {
  // Verify teacher exists
  const teacher = await TeachersMaster.findById(teacherId);
  if (!teacher) {
    throw new CustomError("Teacher not found", statusCode.NOT_FOUND);
  }

  // Update teacher master details
  if (updateData.teacher) {
    // Handle archiving
    if (updateData.teacher.status === "archived" && teacher.status !== "archived") {
      updateData.teacher.archived_at = new Date();
    }

    Object.keys(updateData.teacher).forEach((key) => {
      if (updateData.teacher[key] !== undefined && key !== '_id' && key !== 'teacher_code') {
        teacher[key] = updateData.teacher[key];
      }
    });

    teacher.updated_at = new Date();
    await teacher.save();
  }

  // Update contact information
  if (updateData.contact_information && Array.isArray(updateData.contact_information)) {
    for (const contact of updateData.contact_information) {
      if (contact._id) {
        // Update existing contact
        const { _id, teacher_id, createdAt, __v, ...contactUpdateData } = contact;
        await TeacherContactInformation.findByIdAndUpdate(
          contact._id,
          { ...contactUpdateData, updatedAt: new Date() },
          { new: true, runValidators: true }
        );
      } else {
        // Create new contact
        const { _id, ...newContactData } = contact;
        await TeacherContactInformation.create({
          ...newContactData,
          teacher_id: teacherId,
        });
      }
    }
  }

  // Update addresses
  if (updateData.addresses && Array.isArray(updateData.addresses)) {
    for (const address of updateData.addresses) {
      if (address._id) {
        // Update existing address
        const { _id, teacher_id, createdAt, __v, ...addressUpdateData } = address;
        await TeacherAddresses.findByIdAndUpdate(
          address._id,
          { ...addressUpdateData, updatedAt: new Date() },
          { new: true, runValidators: true }
        );
      } else {
        // Create new address
        const { _id, ...newAddressData } = address;
        await TeacherAddresses.create({
          ...newAddressData,
          teacher_id: teacherId,
        });
      }
    }
  }

  // Update emergency contacts
  if (updateData.emergency_contacts && Array.isArray(updateData.emergency_contacts)) {
    for (const contact of updateData.emergency_contacts) {
      if (contact._id) {
        // Update existing emergency contact
        const { _id, teacher_id, createdAt, __v, ...contactUpdateData } = contact;
        await TeacherEmergencyContacts.findByIdAndUpdate(
          contact._id,
          { ...contactUpdateData, updatedAt: new Date() },
          { new: true, runValidators: true }
        );
      } else {
        // Create new emergency contact
        const { _id, ...newContactData } = contact;
        await TeacherEmergencyContacts.create({
          ...newContactData,
          teacher_id: teacherId,
        });
      }
    }
  }

  // Fetch and return updated teacher details with all related info
  return await getTeacherWithAllDetails(teacherId);
}; 


const createTeacher = async (teacherData) => {


     //Fetch institute & validate type

  const institute = await Institute.findById(
    teacherData.institute_id,
    { institute_type: 1 }
  );

  if (!institute) {
    throw new CustomError(
      "Institute not found",
      statusCode.NOT_FOUND
    );
  }

  if (institute.institute_type !== teacherData.teacher_type) {
    throw new CustomError(
      `Teacher type must be '${institute.institute_type}' for this institute`,
      statusCode.BAD_REQUEST
    );
  }

  
    // Generate teacher code
  

  const teacherCode = await generateTeacherCode(
    teacherData.institute_id,
    teacherData.teacher_type
  );


  //   Create teacher


  const teacher = new TeachersMaster({
    institute_id: new mongoose.Types.ObjectId(teacherData.institute_id),

    teacher_code: teacherCode,
    teacher_type: teacherData.teacher_type,

    full_name: teacherData.full_name,
    gender: teacherData.gender,

    date_of_birth: new Date(teacherData.date_of_birth),

    marital_status: teacherData.marital_status || null,
    spouse_name: teacherData.spouse_name || null,

    employment_type: teacherData.employment_type,
    joining_date: teacherData.joining_date
      ? new Date(teacherData.joining_date)
      : null,

    blood_group: teacherData.blood_group || null,

    status: "active",
    created_at: new Date(),
    updated_at: new Date(),
  });

  await teacher.save();
  return teacher;
};




const getAllTeachers = async (filters = {}) => {
  const query = {};

  if (filters.institute_id) query.institute_id = filters.institute_id;
  if (filters.teacher_type) query.teacher_type = filters.teacher_type;
  if (filters.status) query.status = filters.status;
  if (filters.employment_type) query.employment_type = filters.employment_type;

  const teachers = await TeachersMaster.find(query) 
    .populate("institute_id", "institute_name institute_code institute_type ")
    .sort({ createdAt: -1 });

  return teachers;
};

const getTeacherById = async (teacherId) => {
  const teacher = await TeachersMaster.findById(teacherId).populate(
    "institute_id",
    "institute_name institute_code institute_type"
  );

  if (!teacher) {
    throw new CustomError("Teacher not found", statusCode.NOT_FOUND);
  }

  return teacher;
};

const getTeacherByCode = async (teacherCode) => {
  const teacher = await TeachersMaster.findOne({
    teacher_code: teacherCode,
  }).populate("institute_id", "institute_name institute_code institute_type");

  if (!teacher) {
    throw new CustomError("Teacher not found", statusCode.NOT_FOUND);
  }

  return teacher;
};

const updateTeacher = async (teacherId, updateData) => {
  const teacher = await TeachersMaster.findById(teacherId);

  if (!teacher) {
    throw new CustomError("Teacher not found", statusCode.NOT_FOUND);
  }

  // Handle archiving
  if (updateData.status === "archived" && teacher.status !== "archived") {
    updateData.archived_at = new Date();
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      teacher[key] = updateData[key];
    }
  });

  await teacher.save();
  return await TeachersMaster.findById(teacherId).populate(
    "institute_id",
    "institute_name institute_code institute_type"
  );
};

const deleteTeacher = async (teacherId) => {
  const teacher = await TeachersMaster.findById(teacherId);

  if (!teacher) {
    throw new CustomError("Teacher not found", statusCode.NOT_FOUND);
  } 

  // First, fetch all identity documents for this teacher to get file URLs
  const identityDocuments = await TeacherIdentityDocuments.find({ teacher_id: teacherId });

  // Delete associated files from uploads folder
  if (identityDocuments && identityDocuments.length > 0) {
    const UPLOADS_ROOT = require("../middlewares/upload").UPLOADS_ROOT;
    
    identityDocuments.forEach((document) => {
      if (document.file_url) {
        const filePath = path.join(
          UPLOADS_ROOT,
          "teacher_identity_documents",
          path.basename(document.file_url)
        );

        // Check if file exists and delete it
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (fileError) {
            console.error(`Failed to delete file: ${filePath}`, fileError);
            // Continue with deletion even if file removal fails
          }
        }
      }
    });
  }

  // Delete all related records from database
  await Promise.all([
    TeacherContactInformation.deleteMany({ teacher_id: teacherId }),
    TeacherAddresses.deleteMany({ teacher_id: teacherId }),
    TeacherIdentityDocuments.deleteMany({ teacher_id: teacherId }),
    TeacherQualificationDetails.deleteMany({ teacher_id: teacherId }),
    TeacherExperience.deleteMany({ teacher_id: teacherId }),
    TeacherBankDetails.deleteMany({ teacher_id: teacherId }),
    TeacherEmergencyContacts.deleteMany({ teacher_id: teacherId }),
    TeacherAuth.deleteMany({ teacher_id: teacherId }),
    TeacherSalaryStructure.deleteMany({ teacher_id: teacherId }),
    TeacherSalaryTransactions.deleteMany({ teacher_id: teacherId }),
    TeacherAttendance.deleteMany({ teacher_id: teacherId }),
    TeacherLeaves.deleteMany({ teacher_id: teacherId }),
    ClassSubjectSchedule.deleteMany({ teacher_id: teacherId }),
    // TeacherSubjets.deleteMany({ teacher_id: teacherId }),
  ]);

  await TeachersMaster.findByIdAndDelete(teacherId);
  return teacher;
};

 

module.exports = { 
  // Teachers Master
  createTeacher,
  getAllTeachers,
  getTeacherById,
  getTeacherByCode,
  getTeacherWithAllDetails,
  updateTeacherWithAllDetails, 
  updateTeacher,
  deleteTeacher,
};

