const homeworkService = require("../services/homeworkAssignments.service");
const statusCode = require("../enums/statusCode");
const {
  createHomeworkAssignmentValidation,
  updateHomeworkAssignmentValidation,
} = require("../validations/homeworkAssignments.validations");
const path = require("path");
const fs = require("fs");
const { UPLOADS_ROOT } = require("../middlewares/upload");

const createHomeworkAssignment = async (req, res) => {
  try {
    const { error, value } = createHomeworkAssignmentValidation.validate(req.body);
    if (error) {
      // Clean up uploaded files if validation fails
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          const filePath = path.join(
            UPLOADS_ROOT,
            "homework_assignments",
            file.filename
          );
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }

      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const files = req.files || [];
    const assignment = await homeworkService.createHomeworkAssignment(value, files);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: assignment,
      message: "Homework assignment created successfully",
    });
  } catch (err) {
    // Clean up uploaded files if service fails
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const filePath = path.join(
          UPLOADS_ROOT,
          "homework_assignments",
          file.filename
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to create homework assignment",
    });
  }
};

const getAllHomeworkAssignments = async (req, res) => {
  try {
    const filters = {
      institute_id: req.query.institute_id,
      class_id: req.query.class_id,
      section_id: req.query.section_id,
      batch_id: req.query.batch_id,
      subject_id: req.query.subject_id,
      assigned_by: req.query.assigned_by,
      status: req.query.status,
      priority: req.query.priority,
    };

    const assignments = await homeworkService.getAllHomeworkAssignments(filters);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: assignments,
      message: "Homework assignments retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve homework assignments",
    });
  }
};

const getHomeworkAssignmentById = async (req, res) => {
  try {
    const assignment = await homeworkService.getHomeworkAssignmentById(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: assignment,
      message: "Homework assignment retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve homework assignment",
    });
  }
};

const getHomeworkByClass = async (req, res) => {
  try {
    const { class_id } = req.params;
    const { section_id, batch_id } = req.query;

    const assignments = await homeworkService.getHomeworkByClass(
      class_id,
      section_id,
      batch_id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: assignments,
      message: "Class homework assignments retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve class homework assignments",
    });
  }
};

const updateHomeworkAssignment = async (req, res) => {
  try {
    const { error, value } = updateHomeworkAssignmentValidation.validate(req.body);
    if (error) {
      // Clean up uploaded files if validation fails
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          const filePath = path.join(
            UPLOADS_ROOT,
            "homework_assignments",
            file.filename
          );
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }

      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const files = req.files || [];
    const assignment = await homeworkService.updateHomeworkAssignment(
      req.params.id,
      value,
      files
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: assignment,
      message: "Homework assignment updated successfully",
    });
  } catch (err) {
    // Clean up uploaded files if service fails
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const filePath = path.join(
          UPLOADS_ROOT,
          "homework_assignments",
          file.filename
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to update homework assignment",
    });
  }
};

const deleteHomeworkAssignment = async (req, res) => {
  try {
    const result = await homeworkService.deleteHomeworkAssignment(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: {},
      message: result.message,
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to delete homework assignment",
    });
  }
};

const deleteAttachment = async (req, res) => {
  try {
    const { id } = req.params;
    const { attachment_url } = req.body;

    if (!attachment_url) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: "attachment_url is required",
      });
    }

    const assignment = await homeworkService.deleteAttachment(id, attachment_url);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: assignment,
      message: "Attachment deleted successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to delete attachment",
    });
  }
};

module.exports = {
  createHomeworkAssignment,
  getAllHomeworkAssignments,
  getHomeworkAssignmentById,
  getHomeworkByClass,
  updateHomeworkAssignment,
  deleteHomeworkAssignment,
  deleteAttachment,
};
