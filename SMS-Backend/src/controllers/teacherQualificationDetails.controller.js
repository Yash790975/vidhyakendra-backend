const teachersService = require("../services/teacherQualificationDetails.service");
const statusCode = require("../enums/statusCode");
const {
  createQualificationValidation
} = require("../validations/teacherQualificationDetails.validations"); 
const path = require("path");
const fs = require("fs");
const { UPLOADS_ROOT } = require("../middlewares/upload");


// ============= QUALIFICATIONS =============     

const createQualification = async (req, res) => {
  try {
    const { error, value } = createQualificationValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    if (!req.file) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: "Qualification certificate file is required",
      });
    }

    const fileUrl = `/uploads/teacher_qualifications/${req.file.filename}`;

    const qualification = await teachersService.createQualification(value, fileUrl);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: qualification,
      message: "Qualification created successfully",
    });
  } catch (err) {
    if (req.file) {
      const filePath = path.join(UPLOADS_ROOT, "teacher_qualifications", req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to create qualification",
    });
  }
};

const getQualificationsByTeacherId = async (req, res) => {
  try {
    const qualifications = await teachersService.getQualificationsByTeacherId(
      req.params.teacher_id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: qualifications,
      message: "Qualifications retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve qualifications",
    });
  }
};

const updateQualification = async (req, res) => {
  try {
    let newFileUrl = null;
    if (req.file) {
      newFileUrl = `/uploads/teacher_qualifications/${req.file.filename}`;
    }

    const qualification = await teachersService.updateQualification(
      req.params.id,
      req.body,
      newFileUrl
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: qualification,
      message: "Qualification updated successfully",
    });
  } catch (err) {
    if (req.file) {
      const filePath = path.join(UPLOADS_ROOT, "teacher_qualifications", req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to update qualification",
    });
  }
};

const deleteQualification = async (req, res) => {
  try {
    const qualification = await teachersService.deleteQualification(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: qualification,
      message: "Qualification deleted successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to delete qualification",
    });
  }
};


const getAllQualifications = async (req, res) => {
  try {
    const qualifications = await teachersService.getAllQualifications();

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: qualifications,
      message: "All qualifications retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve qualifications",
    });
  }
};

const getQualificationById = async (req, res) => {
  try {
    const qualification = await teachersService.getQualificationById(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: qualification,
      message: "Qualification retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve qualification",
    });
  }
};

module.exports = {
  createQualification,
  getQualificationsByTeacherId,
  getAllQualifications,
  getQualificationById,
  updateQualification,
  deleteQualification
};
