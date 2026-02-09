const TeacherExperience = require("../models/teacherExperience.model");
const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");

 
// ============= EXPERIENCE ============= 

const createExperience = async (experienceData) => {
  const experience = new TeacherExperience(experienceData);
  await experience.save();
  return experience;
};

const getExperiencesByTeacherId = async (teacherId) => {
  const experiences = await TeacherExperience.find({ teacher_id: teacherId });
  return experiences;
};

const updateExperience = async (experienceId, updateData) => {
  const experience = await TeacherExperience.findByIdAndUpdate(
    experienceId,
    updateData,
    { new: true }
  );

  if (!experience) {
    throw new CustomError("Experience not found", statusCode.NOT_FOUND);
  }

  return experience;
};

const deleteExperience = async (experienceId) => {
  const experience = await TeacherExperience.findByIdAndDelete(experienceId);

  if (!experience) {
    throw new CustomError("Experience not found", statusCode.NOT_FOUND);
  }

  return experience;
};
 
const getAllExperiences = async () => {
  const experiences = await TeacherExperience.find()
    .populate("teacher_id", "full_name teacher_code")
    .sort({ createdAt: -1 });

  return experiences;
};

const getExperienceById = async (experienceId) => {
  const experience = await TeacherExperience.findById(experienceId)
    .populate("teacher_id", "full_name teacher_code");

  if (!experience) {
    throw new CustomError("Experience not found", statusCode.NOT_FOUND);
  }

  return experience;
};

module.exports = {
  createExperience,
  getExperiencesByTeacherId,
  getAllExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience
};
