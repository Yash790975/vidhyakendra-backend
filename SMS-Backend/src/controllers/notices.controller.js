const noticeService = require("../services/notices.service");
const statusCode = require("../enums/statusCode");
const {
  createNoticeValidation,
  updateNoticeValidation,
} = require("../validations/notices.validations");
const path = require("path");
const fs = require("fs");
const { UPLOADS_ROOT } = require("../middlewares/upload");

const createNotice = async (req, res) => {
  try {
    const { error, value } = createNoticeValidation.validate(req.body);
    if (error) {
      // Clean up uploaded file if validation fails
      if (req.file) {
        const filePath = path.join(
          UPLOADS_ROOT,
          "institute_notices",
          req.file.filename
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const fileUrl = req.file ? `/uploads/institute_notices/${req.file.filename}` : null;

    const notice = await noticeService.createNotice(value, fileUrl);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: notice,
      message: "Notice created successfully",
    });
  } catch (err) {
    // Clean up uploaded file if service fails
    if (req.file) {
      const filePath = path.join(
        UPLOADS_ROOT,
        "institute_notices",
        req.file.filename
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

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
      instituteId: req.query.instituteId,
      createdBy: req.query.createdBy,
      createdByRole: req.query.createdByRole,
      status: req.query.status,
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

const getExpiredNotices = async (req, res) => {
  try {
    const filters = {
      instituteId: req.query.instituteId,
      createdBy: req.query.createdBy,
      createdByRole: req.query.createdByRole,
      category: req.query.category,
      audience_type: req.query.audience_type,
    };

    const notices = await noticeService.getExpiredNotices(filters);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: notices,
      message: "Expired notices retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve expired notices",
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

const getNoticesForStudent = async (req, res) => {
  try {
    const { student_id, institute_id } = req.params;

    const notices = await noticeService.getNoticesForStudent(
      student_id,
      institute_id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: notices,
      message: "Student notices retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve student notices",
    });
  }
};

const getNoticesForTeacher = async (req, res) => {
  try {
    const { teacher_id, institute_id } = req.params;

    const notices = await noticeService.getNoticesForTeacher(
      teacher_id,
      institute_id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: notices,
      message: "Teacher notices retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve teacher notices",
    });
  }
};

const getNoticesForClass = async (req, res) => {
  try {
    const { class_id, institute_id } = req.params;
    const { section_id } = req.query;

    const notices = await noticeService.getNoticesForClass(
      class_id,
      section_id,
      institute_id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: notices,
      message: "Class notices retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve class notices",
    });
  }
};

const updateNotice = async (req, res) => {
  try {
    const { error, value } = updateNoticeValidation.validate(req.body);
    if (error) {
      // Clean up uploaded file if validation fails
      if (req.file) {
        const filePath = path.join(
          UPLOADS_ROOT,
          "institute_notices",
          req.file.filename
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const newFileUrl = req.file ? `/uploads/institute_notices/${req.file.filename}` : null;

    const notice = await noticeService.updateNotice(req.params.id, value, newFileUrl);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: notice,
      message: "Notice updated successfully",
    });
  } catch (err) {
    // Clean up uploaded file if service fails
    if (req.file) {
      const filePath = path.join(
        UPLOADS_ROOT,
        "institute_notices",
        req.file.filename
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

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
  getExpiredNotices,
  getNoticeById,
  getNoticesForStudent,
  getNoticesForTeacher,
  getNoticesForClass,
  updateNotice,
  deleteNotice,
  publishNotice,
  archiveNotice,
};
























































// const noticeService = require("../services/notices.service");
// const statusCode = require("../enums/statusCode");
// const {
//   createNoticeValidation,
//   updateNoticeValidation,
// } = require("../validations/notices.validations");

// const createNotice = async (req, res) => {   
//   try {
//     const { error, value } = createNoticeValidation.validate(req.body);
//     if (error) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: {},
//         message: error.details[0].message,
//       });
//     }

//     const notice = await noticeService.createNotice(value);

//     res.status(statusCode.CREATED).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.CREATED,
//       result: notice,
//       message: "Notice created successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to create notice",
//     });
//   }
// };

// const getAllNotices = async (req, res) => {
//   try {
//     const filters = {
//       instituteId: req.query.instituteId,
//       createdBy: req.query.createdBy,
//       createdByRole: req.query.createdByRole,
//       status: req.query.status,
//       category: req.query.category,
//       isPinned: req.query.isPinned,
//       audience_type: req.query.audience_type,
//     };

//     const notices = await noticeService.getAllNotices(filters);

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: notices,
//       message: "Notices retrieved successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to retrieve notices",
//     });
//   }
// };

// const getNoticeById = async (req, res) => {
//   try {
//     const notice = await noticeService.getNoticeById(req.params.id);

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: notice,
//       message: "Notice retrieved successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to retrieve notice",
//     });
//   }
// };

// const getNoticesForStudent = async (req, res) => {
//   try {
//     const { student_id, institute_id } = req.params;

//     const notices = await noticeService.getNoticesForStudent(
//       student_id,
//       institute_id
//     );

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: notices,
//       message: "Student notices retrieved successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to retrieve student notices",
//     });
//   }
// };

// const getNoticesForTeacher = async (req, res) => {
//   try {
//     const { teacher_id, institute_id } = req.params;

//     const notices = await noticeService.getNoticesForTeacher(
//       teacher_id,
//       institute_id
//     );

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: notices,
//       message: "Teacher notices retrieved successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to retrieve teacher notices",
//     });
//   }
// };

// const getNoticesForClass = async (req, res) => {
//   try {
//     const { class_id, institute_id } = req.params;
//     const { section_id } = req.query;

//     const notices = await noticeService.getNoticesForClass(
//       class_id,
//       section_id,
//       institute_id
//     );

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: notices,
//       message: "Class notices retrieved successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to retrieve class notices",
//     });
//   }
// };

// const updateNotice = async (req, res) => {
//   try {
//     const { error, value } = updateNoticeValidation.validate(req.body);
//     if (error) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: {},
//         message: error.details[0].message,
//       });
//     }

//     const notice = await noticeService.updateNotice(req.params.id, value);

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: notice,
//       message: "Notice updated successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to update notice",
//     });
//   }
// };

// const deleteNotice = async (req, res) => {
//   try {
//     const result = await noticeService.deleteNotice(req.params.id);

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: {},
//       message: result.message,
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to delete notice",
//     });
//   }
// };

// const publishNotice = async (req, res) => {
//   try {
//     const notice = await noticeService.publishNotice(req.params.id);

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: notice,
//       message: "Notice published successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to publish notice",
//     });
//   }
// };

// const archiveNotice = async (req, res) => {
//   try {
//     const notice = await noticeService.archiveNotice(req.params.id);

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: notice,
//       message: "Notice archived successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to archive notice",
//     });
//   }
// };

// module.exports = {
//   createNotice,
//   getAllNotices,
//   getNoticeById,
//   getNoticesForStudent,
//   getNoticesForTeacher,
//   getNoticesForClass,
//   updateNotice,
//   deleteNotice,
//   publishNotice,
//   archiveNotice,
// };