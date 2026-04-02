const submissionService = require("../services/homeworkSubmissions.service");
const statusCode = require("../enums/statusCode");
const {
  createHomeworkSubmissionValidation,
  updateHomeworkSubmissionValidation,
  evaluateHomeworkValidation,
} = require("../validations/homeworkSubmissions.validations");
const path = require("path");
const fs = require("fs");
const { UPLOADS_ROOT } = require("../middlewares/upload");

const createHomeworkSubmission = async (req, res) => {
  try {
    const { error, value } = createHomeworkSubmissionValidation.validate(req.body);
    if (error) {
      // Clean up uploaded files if validation fails
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          const filePath = path.join(
            UPLOADS_ROOT,
            "homework_submissions",
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
    const submission = await submissionService.createHomeworkSubmission(value, files);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: submission,
      message: "Homework submission created successfully",
    });
  } catch (err) {
    // Clean up uploaded files if service fails
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const filePath = path.join(
          UPLOADS_ROOT,
          "homework_submissions",
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
      message: err.message || "Failed to create homework submission",
    });
  }
};

const getAllHomeworkSubmissions = async (req, res) => {
  try {
    const filters = {
      homework_id: req.query.homework_id,
      student_id: req.query.student_id,
      status: req.query.status,
      is_late: req.query.is_late,
    };

    const submissions = await submissionService.getAllHomeworkSubmissions(filters);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: submissions,
      message: "Homework submissions retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve homework submissions",
    });
  }
};

const getHomeworkSubmissionById = async (req, res) => {
  try {
    const submission = await submissionService.getHomeworkSubmissionById(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: submission,
      message: "Homework submission retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve homework submission",
    });
  }
};

const updateHomeworkSubmission = async (req, res) => {
  try {
    const { error, value } = updateHomeworkSubmissionValidation.validate(req.body);
    if (error) {
      // Clean up uploaded files if validation fails
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          const filePath = path.join(
            UPLOADS_ROOT,
            "homework_submissions",
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
    const submission = await submissionService.updateHomeworkSubmission(
      req.params.id,
      value,
      files
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: submission,
      message: "Homework submission updated successfully",
    });
  } catch (err) {
    // Clean up uploaded files if service fails
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const filePath = path.join(
          UPLOADS_ROOT,
          "homework_submissions",
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
      message: err.message || "Failed to update homework submission",
    });
  }
};

const evaluateHomeworkSubmission = async (req, res) => {
  try {
    const { error, value } = evaluateHomeworkValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const submission = await submissionService.evaluateHomeworkSubmission(
      req.params.id,
      value
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: submission,
      message: "Homework submission evaluated successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to evaluate homework submission",
    });
  }
};

const deleteHomeworkSubmission = async (req, res) => {
  try {
    const result = await submissionService.deleteHomeworkSubmission(req.params.id);

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
      message: err.message || "Failed to delete homework submission",
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

    const submission = await submissionService.deleteAttachment(id, attachment_url);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: submission,
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
  createHomeworkSubmission,
  getAllHomeworkSubmissions,
  getHomeworkSubmissionById,
  updateHomeworkSubmission,
  evaluateHomeworkSubmission,
  deleteHomeworkSubmission,
  deleteAttachment,
};
