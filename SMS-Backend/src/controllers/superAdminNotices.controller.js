const noticeService = require("../services/superAdminNotices.service");
const statusCode = require("../enums/statusCode");
const {
  createSuperAdminNoticeValidation,
  updateSuperAdminNoticeValidation,
} = require("../validations/superAdminNotices.validations");

const createNotice = async (req, res) => {
  try {
    const { error, value } = createSuperAdminNoticeValidation.validate(
      req.body
    );
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const notice = await noticeService.createNotice(value);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: notice,
      message: "Notice created successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to create notice",
    });
  }
};

const getAllNotices = async (req, res) => {
  try {
    const filters = {
      createdBy: req.query.createdBy,
      status: req.query.status,
      priority: req.query.priority,
      category: req.query.category,
      isPinned: req.query.isPinned,
      audience_type: req.query.audience_type,
    };

    const notices = await noticeService.getAllNotices(filters);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: notices,
      message: "Notices retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve notices",
    });
  }
};

const getNoticeById = async (req, res) => {
  try {
    const notice = await noticeService.getNoticeById(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: notice,
      message: "Notice retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve notice",
    });
  }
};

const getNoticesForInstitute = async (req, res) => {
  try {
    const notices = await noticeService.getNoticesForInstitute(
      req.params.institute_id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: notices,
      message: "Institute notices retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve institute notices",
    });
  }
};

const getPublishedNotices = async (req, res) => {
  try {
    const notices = await noticeService.getPublishedNotices();

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: notices,
      message: "Published notices retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve published notices",
    });
  }
};

const updateNotice = async (req, res) => {
  try {
    const { error, value } = updateSuperAdminNoticeValidation.validate(
      req.body
    );
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const notice = await noticeService.updateNotice(req.params.id, value);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: notice,
      message: "Notice updated successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to update notice",
    });
  }
};

const deleteNotice = async (req, res) => {
  try {
    const result = await noticeService.deleteNotice(req.params.id);

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
      message: err.message || "Failed to delete notice",
    });
  }
};

const publishNotice = async (req, res) => {
  try {
    const notice = await noticeService.publishNotice(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: notice,
      message: "Notice published successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to publish notice",
    });
  }
};

const archiveNotice = async (req, res) => {
  try {
    const notice = await noticeService.archiveNotice(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: notice,
      message: "Notice archived successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to archive notice",
    });
  }
};

module.exports = {
  createNotice,
  getAllNotices,
  getNoticeById,
  getNoticesForInstitute,
  getPublishedNotices,
  updateNotice,
  deleteNotice,
  publishNotice,
  archiveNotice,
};