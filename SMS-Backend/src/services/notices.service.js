const Notices = require("../models/notices.model");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");

const createNotice = async (noticeData, fileUrl = null) => {
  // Set the correct model reference based on role
  const createdByModel =
    noticeData.createdByRole === "institute_admin"
      ? "institute_admins"
      : "TeachersMaster"; 
   
  const notice = new Notices({
    title: noticeData.title,
    content: noticeData.content,
    fullDescription: noticeData.fullDescription,
    docUrl: fileUrl,
    instituteId: new mongoose.Types.ObjectId(noticeData.instituteId),
    createdBy: new mongoose.Types.ObjectId(noticeData.createdBy),
    createdByModel: createdByModel,
    createdByRole: noticeData.createdByRole,
    audience: {
      type: noticeData.audience.type,
      classIds:
        noticeData.audience.classIds && noticeData.audience.classIds.length > 0
          ? noticeData.audience.classIds.map((id) =>
              new mongoose.Types.ObjectId(id)
            )
          : null,
      sectionIds:
        noticeData.audience.sectionIds &&
        noticeData.audience.sectionIds.length > 0
          ? noticeData.audience.sectionIds.map((id) =>
              new mongoose.Types.ObjectId(id)
            )
          : null,
      batchIds:
        noticeData.audience.batchIds && noticeData.audience.batchIds.length > 0
          ? noticeData.audience.batchIds.map((id) =>
              new mongoose.Types.ObjectId(id)
            )
          : null,
      studentIds:
        noticeData.audience.studentIds &&
        noticeData.audience.studentIds.length > 0
          ? noticeData.audience.studentIds.map((id) =>
              new mongoose.Types.ObjectId(id)
            )
          : null,
      teacherIds:
        noticeData.audience.teacherIds &&
        noticeData.audience.teacherIds.length > 0
          ? noticeData.audience.teacherIds.map((id) =>
              new mongoose.Types.ObjectId(id)
            )
          : null,
    },
    category: noticeData.category,
    isPinned: noticeData.isPinned || false,
    publishDate: noticeData.publishDate || null,
    expiryDate: noticeData.expiryDate || null,
    status: "draft",
  });

  await notice.save();
  return notice;
};

const getAllNotices = async (filters = {}) => {
  const query = { status: { $ne: "expired" } };

  if (filters.instituteId) query.instituteId = filters.instituteId;
  if (filters.createdBy) query.createdBy = filters.createdBy;
  if (filters.createdByRole) query.createdByRole = filters.createdByRole;
  if (filters.status) query.status = filters.status;
  if (filters.category) query.category = filters.category;
  if (filters.isPinned !== undefined) query.isPinned = filters.isPinned;
  if (filters.audience_type) query["audience.type"] = filters.audience_type;

  const notices = await Notices.find(query)
    .populate("instituteId", "institute_name institute_code")
    .populate("createdBy")
    .populate("audience.classIds", "class_name")
    .populate("audience.sectionIds", "section_name")
    .populate("audience.batchIds", "batch_name")
    .populate("audience.studentIds", "full_name student_code")
    .populate("audience.teacherIds", "full_name teacher_code")
    .sort({ isPinned: -1, publishDate: -1 });

  return notices;
};

const getExpiredNotices = async (filters = {}) => {
  const query = { status: "expired" };

  if (filters.instituteId) query.instituteId = filters.instituteId;
  if (filters.createdBy) query.createdBy = filters.createdBy;
  if (filters.createdByRole) query.createdByRole = filters.createdByRole;
  if (filters.category) query.category = filters.category;
  if (filters.audience_type) query["audience.type"] = filters.audience_type;

  const notices = await Notices.find(query)
    .populate("instituteId", "institute_name institute_code")
    .populate("createdBy")
    .populate("audience.classIds", "class_name")
    .populate("audience.sectionIds", "section_name")
    .populate("audience.batchIds", "batch_name")
    .populate("audience.studentIds", "full_name student_code")
    .populate("audience.teacherIds", "full_name teacher_code")
    .sort({ publishDate: -1 });

  return notices;
};

const getNoticeById = async (noticeId) => {
  const notice = await Notices.findById(noticeId)
    .populate("instituteId", "institute_name institute_code")
    .populate("createdBy")
    .populate("audience.classIds", "class_name")
    .populate("audience.sectionIds", "section_name")
    .populate("audience.batchIds", "batch_name")
    .populate("audience.studentIds", "full_name student_code")
    .populate("audience.teacherIds", "full_name teacher_code");

  if (!notice) {
    throw new CustomError("Notice not found", statusCode.NOT_FOUND);
  }

  return notice;
};

// Get notices for a specific student
const getNoticesForStudent = async (studentId, instituteId) => {
  const notices = await Notices.find({
    instituteId: instituteId,
    status: "published",
    $or: [
      { "audience.type": "all" },
      { "audience.type": "students" },
      { "audience.studentIds": studentId },
    ],
    $or: [{ expiryDate: null }, { expiryDate: { $gte: new Date() } }],
  })
    .populate("createdBy")
    .sort({ isPinned: -1, publishDate: -1 });

  return notices;
};

// Get notices for a specific teacher
const getNoticesForTeacher = async (teacherId, instituteId) => {
  const notices = await Notices.find({
    instituteId: instituteId,
    status: "published",
    $or: [
      { "audience.type": "all" },
      { "audience.type": "teachers" },
      { "audience.teacherIds": teacherId },
    ],
    $or: [{ expiryDate: null }, { expiryDate: { $gte: new Date() } }],
  })
    .populate("createdBy")
    .sort({ isPinned: -1, publishDate: -1 });

  return notices;
};

// Get notices for a specific class/section
const getNoticesForClass = async (classId, sectionId = null, instituteId) => {
  const query = {
    instituteId: instituteId,
    status: "published",
    $or: [
      { "audience.type": "all" },
      { "audience.type": "students" },
      { "audience.classIds": classId },
    ],
    $or: [{ expiryDate: null }, { expiryDate: { $gte: new Date() } }],
  };

  if (sectionId) {
    query.$or.push({ "audience.sectionIds": sectionId });
  }

  const notices = await Notices.find(query)
    .populate("createdBy")
    .sort({ isPinned: -1, publishDate: -1 });

  return notices;
};

const updateNotice = async (noticeId, updateData, newFileUrl = null) => {
  const notice = await Notices.findById(noticeId);

  if (!notice) {
    throw new CustomError("Notice not found", statusCode.NOT_FOUND);
  }

  // Delete old file if new file is uploaded
  if (newFileUrl && notice.docUrl) {
    const oldFilePath = path.join(
      require("../middlewares/upload").UPLOADS_ROOT,
      "institute_notices",
      path.basename(notice.docUrl)
    );

    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }
  }

  if (newFileUrl) {
    notice.docUrl = newFileUrl;
  }

  // Handle audience update
  if (updateData.audience) {
    notice.audience.type = updateData.audience.type || notice.audience.type;

    if (updateData.audience.classIds !== undefined) {
      notice.audience.classIds =
        updateData.audience.classIds && updateData.audience.classIds.length > 0
          ? updateData.audience.classIds.map((id) =>
              new mongoose.Types.ObjectId(id)
            )
          : null;
    }
    if (updateData.audience.sectionIds !== undefined) {
      notice.audience.sectionIds =
        updateData.audience.sectionIds &&
        updateData.audience.sectionIds.length > 0
          ? updateData.audience.sectionIds.map((id) =>
              new mongoose.Types.ObjectId(id)
            )
          : null;
    }
    if (updateData.audience.batchIds !== undefined) {
      notice.audience.batchIds =
        updateData.audience.batchIds &&
        updateData.audience.batchIds.length > 0
          ? updateData.audience.batchIds.map((id) =>
              new mongoose.Types.ObjectId(id)
            )
          : null;
    }
    if (updateData.audience.studentIds !== undefined) {
      notice.audience.studentIds =
        updateData.audience.studentIds &&
        updateData.audience.studentIds.length > 0
          ? updateData.audience.studentIds.map((id) =>
              new mongoose.Types.ObjectId(id)
            )
          : null;
    }
    if (updateData.audience.teacherIds !== undefined) {
      notice.audience.teacherIds =
        updateData.audience.teacherIds &&
        updateData.audience.teacherIds.length > 0
          ? updateData.audience.teacherIds.map((id) =>
              new mongoose.Types.ObjectId(id)
            )
          : null;
    }

    delete updateData.audience;
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined && key !== "audience") {
      notice[key] = updateData[key];
    }
  });

  await notice.save();
  return await Notices.findById(noticeId)
    .populate("instituteId", "institute_name institute_code")
    .populate("createdBy")
    .populate("audience.classIds", "class_name")
    .populate("audience.sectionIds", "section_name")
    .populate("audience.batchIds", "batch_name");
};

const deleteNotice = async (noticeId) => {
  const notice = await Notices.findById(noticeId);

  if (!notice) {
    throw new CustomError("Notice not found", statusCode.NOT_FOUND);
  }

  // Delete file
  if (notice.docUrl) {
    const filePath = path.join(
      require("../middlewares/upload").UPLOADS_ROOT,
      "institute_notices",
      path.basename(notice.docUrl)
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  await Notices.findByIdAndDelete(noticeId);
  return { message: "Notice deleted successfully" };
};

// Publish notice
const publishNotice = async (noticeId) => {
  const notice = await Notices.findById(noticeId);

  if (!notice) {
    throw new CustomError("Notice not found", statusCode.NOT_FOUND);
  }

  notice.status = "published";
  if (!notice.publishDate) {
    notice.publishDate = new Date();
  }
  await notice.save();

  return notice;
};

// Archive notice
const archiveNotice = async (noticeId) => {
  const notice = await Notices.findById(noticeId);

  if (!notice) {
    throw new CustomError("Notice not found", statusCode.NOT_FOUND);
  }

  notice.status = "archived";
  await notice.save();

  return notice;
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




























































// const Notices = require("../models/notices.model");
// const mongoose = require("mongoose");

// const CustomError = require("../exceptions/CustomError");
// const statusCode = require("../enums/statusCode");

// const createNotice = async (noticeData) => {
//   // Set the correct model reference based on role
//   const createdByModel =
//     noticeData.createdByRole === "institute_admin"
//       ? "institute_admins"
//       : "TeachersMaster";
   
//   const notice = new Notices({
//     title: noticeData.title,
//     content: noticeData.content,
//     fullDescription: noticeData.fullDescription,
//     docUrl: noticeData.docUrl || null,
//     instituteId: new mongoose.Types.ObjectId(noticeData.instituteId),
//     createdBy: new mongoose.Types.ObjectId(noticeData.createdBy),
//     createdByModel: createdByModel,
//     createdByRole: noticeData.createdByRole,
//     audience: {
//       type: noticeData.audience.type,
//       classIds:
//         noticeData.audience.classIds && noticeData.audience.classIds.length > 0
//           ? noticeData.audience.classIds.map((id) =>
//               new mongoose.Types.ObjectId(id)
//             )
//           : null,
//       sectionIds:
//         noticeData.audience.sectionIds &&
//         noticeData.audience.sectionIds.length > 0
//           ? noticeData.audience.sectionIds.map((id) =>
//               new mongoose.Types.ObjectId(id)
//             )
//           : null,
//       batchIds:
//         noticeData.audience.batchIds && noticeData.audience.batchIds.length > 0
//           ? noticeData.audience.batchIds.map((id) =>
//               new mongoose.Types.ObjectId(id)
//             )
//           : null,
//       studentIds:
//         noticeData.audience.studentIds &&
//         noticeData.audience.studentIds.length > 0
//           ? noticeData.audience.studentIds.map((id) =>
//               new mongoose.Types.ObjectId(id)
//             )
//           : null,
//       teacherIds:
//         noticeData.audience.teacherIds &&
//         noticeData.audience.teacherIds.length > 0
//           ? noticeData.audience.teacherIds.map((id) =>
//               new mongoose.Types.ObjectId(id)
//             )
//           : null,
//     },
//     category: noticeData.category,
//     isPinned: noticeData.isPinned || false,
//     publishDate: noticeData.publishDate || null,
//     expiryDate: noticeData.expiryDate || null,
//     status: "draft",
//   });

//   await notice.save();
//   return notice;
// };

// const getAllNotices = async (filters = {}) => {
//   const query = {};

//   if (filters.instituteId) query.instituteId = filters.instituteId;
//   if (filters.createdBy) query.createdBy = filters.createdBy;
//   if (filters.createdByRole) query.createdByRole = filters.createdByRole;
//   if (filters.status) query.status = filters.status;
//   if (filters.category) query.category = filters.category;
//   if (filters.isPinned !== undefined) query.isPinned = filters.isPinned;
//   if (filters.audience_type) query["audience.type"] = filters.audience_type;

//   const notices = await Notices.find(query)
//     .populate("instituteId", "institute_name institute_code")
//     .populate("createdBy")
//     .populate("audience.classIds", "class_name")
//     .populate("audience.sectionIds", "section_name")
//     .populate("audience.batchIds", "batch_name")
//     .populate("audience.studentIds", "full_name student_code")
//     .populate("audience.teacherIds", "full_name teacher_code")
//     .sort({ isPinned: -1, publishDate: -1 });

//   return notices;
// };

// const getNoticeById = async (noticeId) => {
//   const notice = await Notices.findById(noticeId)
//     .populate("instituteId", "institute_name institute_code")
//     .populate("createdBy")
//     .populate("audience.classIds", "class_name")
//     .populate("audience.sectionIds", "section_name")
//     .populate("audience.batchIds", "batch_name")
//     .populate("audience.studentIds", "full_name student_code")
//     .populate("audience.teacherIds", "full_name teacher_code");

//   if (!notice) {
//     throw new CustomError("Notice not found", statusCode.NOT_FOUND);
//   }

//   return notice;
// };

// // Get notices for a specific student
// const getNoticesForStudent = async (studentId, instituteId) => {
//   const notices = await Notices.find({
//     instituteId: instituteId,
//     status: "published",
//     $or: [
//       { "audience.type": "all" },
//       { "audience.type": "students" },
//       { "audience.studentIds": studentId },
//     ],
//     $or: [{ expiryDate: null }, { expiryDate: { $gte: new Date() } }],
//   })
//     .populate("createdBy")
//     .sort({ isPinned: -1, publishDate: -1 });

//   return notices;
// };

// // Get notices for a specific teacher
// const getNoticesForTeacher = async (teacherId, instituteId) => {
//   const notices = await Notices.find({
//     instituteId: instituteId,
//     status: "published",
//     $or: [
//       { "audience.type": "all" },
//       { "audience.type": "teachers" },
//       { "audience.teacherIds": teacherId },
//     ],
//     $or: [{ expiryDate: null }, { expiryDate: { $gte: new Date() } }],
//   })
//     .populate("createdBy")
//     .sort({ isPinned: -1, publishDate: -1 });

//   return notices;
// };

// // Get notices for a specific class/section
// const getNoticesForClass = async (classId, sectionId = null, instituteId) => {
//   const query = {
//     instituteId: instituteId,
//     status: "published",
//     $or: [
//       { "audience.type": "all" },
//       { "audience.type": "students" },
//       { "audience.classIds": classId },
//     ],
//     $or: [{ expiryDate: null }, { expiryDate: { $gte: new Date() } }],
//   };

//   if (sectionId) {
//     query.$or.push({ "audience.sectionIds": sectionId });
//   }

//   const notices = await Notices.find(query)
//     .populate("createdBy")
//     .sort({ isPinned: -1, publishDate: -1 });

//   return notices;
// };

// const updateNotice = async (noticeId, updateData) => {
//   const notice = await Notices.findById(noticeId);

//   if (!notice) {
//     throw new CustomError("Notice not found", statusCode.NOT_FOUND);
//   }

//   // Handle audience update
//   if (updateData.audience) {
//     notice.audience.type = updateData.audience.type || notice.audience.type;

//     if (updateData.audience.classIds !== undefined) {
//       notice.audience.classIds =
//         updateData.audience.classIds && updateData.audience.classIds.length > 0
//           ? updateData.audience.classIds.map((id) =>
//               new mongoose.Types.ObjectId(id)
//             )
//           : null;
//     }
//     if (updateData.audience.sectionIds !== undefined) {
//       notice.audience.sectionIds =
//         updateData.audience.sectionIds &&
//         updateData.audience.sectionIds.length > 0
//           ? updateData.audience.sectionIds.map((id) =>
//               new mongoose.Types.ObjectId(id)
//             )
//           : null;
//     }
//     if (updateData.audience.batchIds !== undefined) {
//       notice.audience.batchIds =
//         updateData.audience.batchIds &&
//         updateData.audience.batchIds.length > 0
//           ? updateData.audience.batchIds.map((id) =>
//               new mongoose.Types.ObjectId(id)
//             )
//           : null;
//     }
//     if (updateData.audience.studentIds !== undefined) {
//       notice.audience.studentIds =
//         updateData.audience.studentIds &&
//         updateData.audience.studentIds.length > 0
//           ? updateData.audience.studentIds.map((id) =>
//               new mongoose.Types.ObjectId(id)
//             )
//           : null;
//     }
//     if (updateData.audience.teacherIds !== undefined) {
//       notice.audience.teacherIds =
//         updateData.audience.teacherIds &&
//         updateData.audience.teacherIds.length > 0
//           ? updateData.audience.teacherIds.map((id) =>
//               new mongoose.Types.ObjectId(id)
//             )
//           : null;
//     }

//     delete updateData.audience;
//   }

//   Object.keys(updateData).forEach((key) => {
//     if (updateData[key] !== undefined && key !== "audience") {
//       notice[key] = updateData[key];
//     }
//   });

//   await notice.save();
//   return await Notices.findById(noticeId)
//     .populate("instituteId", "institute_name institute_code")
//     .populate("createdBy")
//     .populate("audience.classIds", "class_name")
//     .populate("audience.sectionIds", "section_name")
//     .populate("audience.batchIds", "batch_name");
// };

// const deleteNotice = async (noticeId) => {
//   const notice = await Notices.findById(noticeId);

//   if (!notice) {
//     throw new CustomError("Notice not found", statusCode.NOT_FOUND);
//   }

//   await Notices.findByIdAndDelete(noticeId);
//   return { message: "Notice deleted successfully" };
// };

// // Publish notice
// const publishNotice = async (noticeId) => {
//   const notice = await Notices.findById(noticeId);

//   if (!notice) {
//     throw new CustomError("Notice not found", statusCode.NOT_FOUND);
//   }

//   notice.status = "published";
//   if (!notice.publishDate) {
//     notice.publishDate = new Date();
//   }
//   await notice.save();

//   return notice;
// };

// // Archive notice
// const archiveNotice = async (noticeId) => {
//   const notice = await Notices.findById(noticeId);

//   if (!notice) {
//     throw new CustomError("Notice not found", statusCode.NOT_FOUND);
//   }

//   notice.status = "archived";
//   await notice.save();

//   return notice;
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