const mongoose = require("mongoose");

const superAdminNoticesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, 
    },
    content: {
      type: String,
      required: true,
    },
    fullDescription: {
      type: String,
      default: null,
    },
    docUrl: {
      type: String,
      default: null,
    },    
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      description: "Super admin ID",
    },
    audience: {
      type: {
        type: String,
        required: true,
        enum: ["all-institutes", "specific-institutes"],
      },
      instituteIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "institutes_master",
        default: null,
      },
    },
    priority: {
      type: String,
      required: true,
      enum: ["low", "medium", "high", "urgent"],
    },
    category: {
      type: String,
      required: true,
      enum: ["academic", "event", "announcement", "news"],
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    publishDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      required: true,
      enum: ["draft", "published", "archived", "expired"],
      default: "draft",
    },
  },
  {
    timestamps: true, 
    collection: "super_admin_notices",
  }
);

// Indexes
superAdminNoticesSchema.index({ createdBy: 1 });
superAdminNoticesSchema.index({ "audience.instituteIds": 1 });
superAdminNoticesSchema.index({ status: 1 });
superAdminNoticesSchema.index({ priority: 1 });
superAdminNoticesSchema.index({ category: 1 });
superAdminNoticesSchema.index({ isPinned: 1 });
superAdminNoticesSchema.index({ publishDate: 1, expiryDate: 1 });
superAdminNoticesSchema.index({ status: 1, publishDate: -1 });

module.exports = mongoose.model("SuperAdminNotices", superAdminNoticesSchema);










































































// const mongoose = require("mongoose");

// const superAdminNoticesSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true, 
//     },
//     content: {
//       type: String,
//       required: true,
//     },
//     fullDescription: {
//       type: String,
//       default: null,
//     },
//     docUrl: {
//       type: String,
//       default: null,
//     },    
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Admin",
//       required: true,
//       description: "Super admin ID",
//     },
//     audience: {
//       type: {
//         type: String,
//         required: true,
//         enum: ["all-institutes", "specific-institutes"],
//       },
//       instituteIds: {
//         type: [mongoose.Schema.Types.ObjectId],
//         ref: "institutes_master",
//         default: null,
//       },
//     },
//     priority: {
//       type: String,
//       required: true,
//       enum: ["low", "medium", "high", "urgent"],
//     },
//     category: {
//       type: String,
//       required: true,
//       enum: ["academic", "event", "announcement", "news"],
//     },
//     isPinned: {
//       type: Boolean,
//       default: false,
//     },
//     publishDate: {
//       type: Date,
//       required: true,
//       default: Date.now,
//     },
//     expiryDate: {
//       type: Date,
//       default: null,
//     },
//     status: {
//       type: String,
//       required: true,
//       enum: ["draft", "published", "archived", "expired"],
//       default: "draft",
//     },
//   },
//   {
//     timestamps: true, 
//     collection: "super_admin_notices",
//   }
// );

// // Indexes
// superAdminNoticesSchema.index({ createdBy: 1 });
// superAdminNoticesSchema.index({ "audience.instituteIds": 1 });
// superAdminNoticesSchema.index({ status: 1 });
// superAdminNoticesSchema.index({ priority: 1 });
// superAdminNoticesSchema.index({ category: 1 });
// superAdminNoticesSchema.index({ isPinned: 1 });
// superAdminNoticesSchema.index({ publishDate: 1, expiryDate: 1 });
// superAdminNoticesSchema.index({ status: 1, publishDate: -1 });

// module.exports = mongoose.model("SuperAdminNotices", superAdminNoticesSchema);