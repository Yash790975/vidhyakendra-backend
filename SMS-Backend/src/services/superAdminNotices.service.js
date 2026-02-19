const SuperAdminNotices = require("../models/superAdminNotices.model");
const InstitutesMaster = require("../models/institutesMaster.model");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");

const createNotice = async (noticeData, fileUrl = null) => { 
  // If audience type is all-institutes, fetch all institute IDs
  if (noticeData.audience.type === "all-institutes") {
    const allInstitutes = await InstitutesMaster.find({ status: "active" }).select("_id");
    noticeData.audience.instituteIds = allInstitutes.map(inst => inst._id);
  }
  
  // Validation: specific-institutes must have instituteIds
  if (
    noticeData.audience.type === "specific-institutes" &&
    (!noticeData.audience.instituteIds ||
      noticeData.audience.instituteIds.length === 0) 
  ) { 
    throw new CustomError(
      "instituteIds is required when audience type is specific-institutes",
      statusCode.BAD_REQUEST
    );
  }

  // Validation: Check if all provided institute IDs exist
  if (
    noticeData.audience.type === "specific-institutes" &&
    noticeData.audience.instituteIds &&
    noticeData.audience.instituteIds.length > 0
  ) {
    const instituteIds = noticeData.audience.instituteIds.map(id => new mongoose.Types.ObjectId(id));
    const existingInstitutes = await InstitutesMaster.find({
      _id: { $in: instituteIds }
    }).select("_id");

    if (existingInstitutes.length !== instituteIds.length) {
      throw new CustomError(
        "One or more institute IDs do not exist",
        statusCode.BAD_REQUEST
      );
    }
  }

  const notice = new SuperAdminNotices({ 
    title: noticeData.title,
    content: noticeData.content,
    fullDescription: noticeData.fullDescription || null,
    docUrl: fileUrl,
    createdBy: new mongoose.Types.ObjectId(noticeData.createdBy),
    audience: {
      type: noticeData.audience.type,
      instituteIds:
        noticeData.audience.instituteIds &&
        noticeData.audience.instituteIds.length > 0
          ? noticeData.audience.instituteIds.map((id) =>
              new mongoose.Types.ObjectId(id)
            )
          : null,
    },
    priority: noticeData.priority,
    category: noticeData.category,
    isPinned: noticeData.isPinned || false,
    publishDate: noticeData.publishDate || new Date(),
    expiryDate: noticeData.expiryDate || null,
    status: "draft",
  });

  await notice.save();
  return notice;
};

const getAllNotices = async (filters = {}) => {
  const query = { status: { $ne: "expired" } };

  if (filters.createdBy) query.createdBy = filters.createdBy;
  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;
  if (filters.category) query.category = filters.category;
  if (filters.isPinned !== undefined) query.isPinned = filters.isPinned;
  if (filters.audience_type) query["audience.type"] = filters.audience_type;

  const notices = await SuperAdminNotices.find(query)
    .populate("createdBy", "name email")
    .populate("audience.instituteIds", "institute_name institute_code")
    .sort({ isPinned: -1, publishDate: -1 });

  return notices;
};

const getExpiredNotices = async (filters = {}) => {
  const query = { status: "expired" };

  if (filters.createdBy) query.createdBy = filters.createdBy;
  if (filters.priority) query.priority = filters.priority;
  if (filters.category) query.category = filters.category;
  if (filters.audience_type) query["audience.type"] = filters.audience_type;

  const notices = await SuperAdminNotices.find(query)
    .populate("createdBy", "name email")
    .populate("audience.instituteIds", "institute_name institute_code")
    .sort({ publishDate: -1 });

  return notices;
};

const getNoticeById = async (noticeId) => {
  const notice = await SuperAdminNotices.findById(noticeId)
    .populate("createdBy", "name email")
    .populate("audience.instituteIds", "institute_name institute_code");

  if (!notice) {
    throw new CustomError("Notice not found", statusCode.NOT_FOUND);
  }

  return notice;
};

// Get notices for a specific institute
const getNoticesForInstitute = async (instituteId) => {
  const notices = await SuperAdminNotices.find({
    $or: [
      { "audience.type": "all-institutes" },
      { "audience.instituteIds": instituteId },
    ],
    status: "published",
    $or: [{ expiryDate: null }, { expiryDate: { $gte: new Date() } }],
  })
    .populate("createdBy", "name email")
    .sort({ isPinned: -1, publishDate: -1 });

  return notices;
};

// Get published notices
const getPublishedNotices = async () => {
  const notices = await SuperAdminNotices.find({
    status: "published",
    $or: [{ expiryDate: null }, { expiryDate: { $gte: new Date() } }],
  })
    .populate("createdBy", "name email")
    .populate("audience.instituteIds", "institute_name institute_code")
    .sort({ isPinned: -1, publishDate: -1 });

  return notices;
}; 

const updateNotice = async (noticeId, updateData, newFileUrl = null) => {
  const notice = await SuperAdminNotices.findById(noticeId);

  if (!notice) {
    throw new CustomError("Notice not found", statusCode.NOT_FOUND);
  }

  // Delete old file if new file is uploaded
  if (newFileUrl && notice.docUrl) {
    const oldFilePath = path.join(
      require("../middlewares/upload").UPLOADS_ROOT,
      "super_admin_notices",
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
    // If changing to all-institutes, fetch all institute IDs
    if (updateData.audience.type === "all-institutes") {
      const allInstitutes = await InstitutesMaster.find({ status: "active" }).select("_id");
      updateData.audience.instituteIds = allInstitutes.map(inst => inst._id);
    }

    // Validation: specific-institutes must have instituteIds
    if (
      updateData.audience.type === "specific-institutes" &&
      (!updateData.audience.instituteIds ||
        updateData.audience.instituteIds.length === 0)
    ) {
      throw new CustomError(
        "instituteIds is required when audience type is specific-institutes",
        statusCode.BAD_REQUEST
      );
    }

    // Validation: Check if all provided institute IDs exist
    if (
      updateData.audience.type === "specific-institutes" &&
      updateData.audience.instituteIds &&
      updateData.audience.instituteIds.length > 0
    ) {
      const instituteIds = updateData.audience.instituteIds.map(id => new mongoose.Types.ObjectId(id));
      const existingInstitutes = await InstitutesMaster.find({
        _id: { $in: instituteIds }
      }).select("_id");

      if (existingInstitutes.length !== instituteIds.length) {
        throw new CustomError(
          "One or more institute IDs do not exist",
          statusCode.BAD_REQUEST
        );
      }
    }

    notice.audience.type = updateData.audience.type;
    notice.audience.instituteIds =
      updateData.audience.instituteIds &&
      updateData.audience.instituteIds.length > 0
        ? updateData.audience.instituteIds.map((id) =>
            new mongoose.Types.ObjectId(id)
          )
        : null;
    delete updateData.audience;
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined && key !== "audience") {
      notice[key] = updateData[key];
    }
  });

  await notice.save();
  return await SuperAdminNotices.findById(noticeId)
    .populate("createdBy", "name email")
    .populate("audience.instituteIds", "institute_name institute_code");
};

const deleteNotice = async (noticeId) => {
  const notice = await SuperAdminNotices.findById(noticeId);

  if (!notice) {
    throw new CustomError("Notice not found", statusCode.NOT_FOUND);
  }

  // Delete file
  if (notice.docUrl) {
    const filePath = path.join(
      require("../middlewares/upload").UPLOADS_ROOT,
      "super_admin_notices",
      path.basename(notice.docUrl)
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  await SuperAdminNotices.findByIdAndDelete(noticeId);
  return { message: "Notice deleted successfully" };
};
     
// Publish notice
const publishNotice = async (noticeId) => {
  const notice = await SuperAdminNotices.findById(noticeId);

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
  const notice = await SuperAdminNotices.findById(noticeId);

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
  getNoticesForInstitute,
  getPublishedNotices,
  updateNotice,
  deleteNotice,
  publishNotice,
  archiveNotice,
};


















































































// const SuperAdminNotices = require("../models/superAdminNotices.model");
// const mongoose = require("mongoose");

// const CustomError = require("../exceptions/CustomError"); 
// const statusCode = require("../enums/statusCode");

// const createNotice = async (noticeData) => { 
//   // Validation: specific-institutes must have instituteIds
//   if (
//     noticeData.audience.type === "specific-institutes" &&
//     (!noticeData.audience.instituteIds ||
//       noticeData.audience.instituteIds.length === 0) 
//   ) { 
//     throw new CustomError(
//       "instituteIds is required when audience type is specific-institutes",
//       statusCode.BAD_REQUEST
//     );
//   }

//   const notice = new SuperAdminNotices({ 
//     title: noticeData.title,
//     content: noticeData.content,
//     fullDescription: noticeData.fullDescription || null,
//     docUrl: noticeData.docUrl || null,
//     createdBy: new mongoose.Types.ObjectId(noticeData.createdBy),
//     audience: {
//       type: noticeData.audience.type,
//       instituteIds:
//         noticeData.audience.instituteIds &&
//         noticeData.audience.instituteIds.length > 0
//           ? noticeData.audience.instituteIds.map((id) =>
//               new mongoose.Types.ObjectId(id)
//             )
//           : null,
//     },
//     priority: noticeData.priority,
//     category: noticeData.category,
//     isPinned: noticeData.isPinned || false,
//     publishDate: noticeData.publishDate || new Date(),
//     expiryDate: noticeData.expiryDate || null,
//     status: "draft",
//   });

//   await notice.save();
//   return notice;
// };

// const getAllNotices = async (filters = {}) => {
//   const query = {};

//   if (filters.createdBy) query.createdBy = filters.createdBy;
//   if (filters.status) query.status = filters.status;
//   if (filters.priority) query.priority = filters.priority;
//   if (filters.category) query.category = filters.category;
//   if (filters.isPinned !== undefined) query.isPinned = filters.isPinned;
//   if (filters.audience_type) query["audience.type"] = filters.audience_type;

//   const notices = await SuperAdminNotices.find(query)
//     .populate("createdBy", "name email")
//     .populate("audience.instituteIds", "institute_name institute_code")
//     .sort({ isPinned: -1, publishDate: -1 });

//   return notices;
// };

// const getNoticeById = async (noticeId) => {
//   const notice = await SuperAdminNotices.findById(noticeId)
//     .populate("createdBy", "name email")
//     .populate("audience.instituteIds", "institute_name institute_code");

//   if (!notice) {
//     throw new CustomError("Notice not found", statusCode.NOT_FOUND);
//   }

//   return notice;
// };

// // Get notices for a specific institute
// const getNoticesForInstitute = async (instituteId) => {
//   const notices = await SuperAdminNotices.find({
//     $or: [
//       { "audience.type": "all-institutes" },
//       { "audience.instituteIds": instituteId },
//     ],
//     status: "published",
//     $or: [{ expiryDate: null }, { expiryDate: { $gte: new Date() } }],
//   })
//     .populate("createdBy", "name email")
//     .sort({ isPinned: -1, publishDate: -1 });

//   return notices;
// };

// // Get published notices
// const getPublishedNotices = async () => {
//   const notices = await SuperAdminNotices.find({
//     status: "published",
//     $or: [{ expiryDate: null }, { expiryDate: { $gte: new Date() } }],
//   })
//     .populate("createdBy", "name email")
//     .populate("audience.instituteIds", "institute_name institute_code")
//     .sort({ isPinned: -1, publishDate: -1 });

//   return notices;
// };

// const updateNotice = async (noticeId, updateData) => {
//   const notice = await SuperAdminNotices.findById(noticeId);

//   if (!notice) {
//     throw new CustomError("Notice not found", statusCode.NOT_FOUND);
//   }

//   // Validation: specific-institutes must have instituteIds
//   if (
//     updateData.audience &&
//     updateData.audience.type === "specific-institutes" &&
//     (!updateData.audience.instituteIds ||
//       updateData.audience.instituteIds.length === 0)
//   ) {
//     throw new CustomError(
//       "instituteIds is required when audience type is specific-institutes",
//       statusCode.BAD_REQUEST
//     );
//   }

//   // Handle audience update
//   if (updateData.audience) {
//     notice.audience.type = updateData.audience.type;
//     notice.audience.instituteIds =
//       updateData.audience.instituteIds &&
//       updateData.audience.instituteIds.length > 0
//         ? updateData.audience.instituteIds.map((id) =>
//             new mongoose.Types.ObjectId(id)
//           )
//         : null;
//     delete updateData.audience;
//   }

//   Object.keys(updateData).forEach((key) => {
//     if (updateData[key] !== undefined && key !== "audience") {
//       notice[key] = updateData[key];
//     }
//   });

//   await notice.save();
//   return await SuperAdminNotices.findById(noticeId)
//     .populate("createdBy", "name email")
//     .populate("audience.instituteIds", "institute_name institute_code");
// };

// const deleteNotice = async (noticeId) => {
//   const notice = await SuperAdminNotices.findById(noticeId);

//   if (!notice) {
//     throw new CustomError("Notice not found", statusCode.NOT_FOUND);
//   }

//   await SuperAdminNotices.findByIdAndDelete(noticeId);
//   return { message: "Notice deleted successfully" };
// };
     
// // Publish notice
// const publishNotice = async (noticeId) => {
//   const notice = await SuperAdminNotices.findById(noticeId);

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
//   const notice = await SuperAdminNotices.findById(noticeId);

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
//   getNoticesForInstitute,
//   getPublishedNotices,
//   updateNotice,
//   deleteNotice,
//   publishNotice,
//   archiveNotice,
// };