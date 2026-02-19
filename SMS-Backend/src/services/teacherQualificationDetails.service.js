const TeacherQualificationDetails = require("../models/teacherQualificationDetails.model");
const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// ============= QUALIFICATIONS (with files) =============

const createQualification = async (qualificationData, fileUrl) => {

  // const existingQualificationDetails = await TeacherQualificationDetails.findOne({
  //     teacher_id: qualificationData.teacher_id
  //   });
  
  //   if (existingQualificationDetails) {
  //     throw new Error("Qualification details already exist for this teacher");
  //   }


  const qualification = new TeacherQualificationDetails({
    ...qualificationData, 
    file_url: fileUrl,
  }); 

  await qualification.save();
  return qualification;
};

const getQualificationsByTeacherId = async (teacherId) => {
  const qualifications = await TeacherQualificationDetails.find({
    teacher_id: teacherId,
  });

  return qualifications;
};

const updateQualification = async (qualificationId, updateData, newFileUrl = null) => {
  const qualification = await TeacherQualificationDetails.findById(qualificationId);

  if (!qualification) {
    throw new CustomError("Qualification not found", statusCode.NOT_FOUND);
  }

  // Delete old file if new file is uploaded
  if (newFileUrl && qualification.file_url) {
    const oldFilePath = path.join(
      require("../middlewares/upload").UPLOADS_ROOT,
      "teacher_qualifications",
      path.basename(qualification.file_url)
    );

    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }
  }

  if (newFileUrl) {
    qualification.file_url = newFileUrl;
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      qualification[key] = updateData[key];
    }
  });

  await qualification.save();
  return qualification;
};

const deleteQualification = async (qualificationId) => {
  const qualification = await TeacherQualificationDetails.findById(qualificationId);

  if (!qualification) {
    throw new CustomError("Qualification not found", statusCode.NOT_FOUND);
  }

  // Delete file
  if (qualification.file_url) {
    const filePath = path.join(
      require("../middlewares/upload").UPLOADS_ROOT,
      "teacher_qualifications",
      path.basename(qualification.file_url)
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); 
    }
  }

  await TeacherQualificationDetails.findByIdAndDelete(qualificationId);
  return qualification;
};

const getAllQualifications = async () => {
  const qualifications = await TeacherQualificationDetails.find()
    .populate("teacher_id", "full_name teacher_code")
    .sort({ createdAt: -1 });

  return qualifications;
};

const getQualificationById = async (qualificationId) => {
  const qualification = await TeacherQualificationDetails.findById(qualificationId)
    .populate("teacher_id", "full_name teacher_code");

  if (!qualification) {
    throw new CustomError("Qualification not found", statusCode.NOT_FOUND);
  }

  return qualification;
};

module.exports = {
  createQualification,
  getQualificationsByTeacherId, 
  getAllQualifications,
  getQualificationById,
  updateQualification,
  deleteQualification
};
