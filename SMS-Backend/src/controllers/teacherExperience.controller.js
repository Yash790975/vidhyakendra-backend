
const teachersService = require("../services/teacherExperience.service");
const statusCode = require("../enums/statusCode");
const {
  createExperienceValidation
} = require("../validations/teacherExperience.validations");    


const createExperience = async (req, res) => {
  try {
    const { error, value } = createExperienceValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const experience = await teachersService.createExperience(value);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: experience,
      message: "Experience created successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to create experience",
    });
  }
};

const getExperiencesByTeacherId = async (req, res) => {
  try {
    const experiences = await teachersService.getExperiencesByTeacherId(
      req.params.teacher_id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: experiences,
      message: "Experiences retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve experiences",
    });
  }
};

const updateExperience = async (req, res) => {
  try {
    const experience = await teachersService.updateExperience(
      req.params.id,
      req.body
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: experience,
      message: "Experience updated successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to update experience",
    });
  }
};

const deleteExperience = async (req, res) => {
  try {
    const experience = await teachersService.deleteExperience(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: experience,
      message: "Experience deleted successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to delete experience",
    });
  }
};


const getAllExperiences = async (req, res) => {
  try {
    const experiences = await teachersService.getAllExperiences();

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: experiences,
      message: "All experiences retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve experiences",
    });
  }
};

const getExperienceById = async (req, res) => {
  try {
    const experience = await teachersService.getExperienceById(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: experience,
      message: "Experience retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve experience",
    });
  }
};


module.exports = {
  createExperience,
  getExperiencesByTeacherId,
  getAllExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience
};
