const mongoose = require("mongoose");

const noticesSchema = new mongoose.Schema(
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
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "institutes_master",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "createdByModel",
      required: true,
    },
    createdByModel: {
      type: String,
      required: true,
      enum: ["institute_admins", "TeachersMaster"],
    },
    createdByRole: {
      type: String,
      required: true,
      enum: ["institute_admin", "teacher"],
    },
    audience: {
      type: {
        type: String,
        required: true,
        enum: [
          "all",
          "teachers",
          "students",
          "specific-classes",
          "specific-users",
        ],
      },
      classIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "ClassesMaster",
        default: null,
      },
      sectionIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "ClassSections",
        default: null,
      },
      batchIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "CoachingBatches",
        default: null,
      },
      studentIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "StudentsMaster",
        default: null,
      },
      teacherIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "TeachersMaster",
        default: null,
      },
    },
    category: {
      type: String,
      required: true,
      enum: ["urgent", "academic", "events", "news"],
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    publishDate: {
      type: Date,
      default: null,
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
    collection: "notices",
  }
);

// Indexes as per schema
noticesSchema.index({ instituteId: 1, status: 1 });
noticesSchema.index({ createdBy: 1, createdByRole: 1 });
noticesSchema.index({ "audience.classIds": 1 });
noticesSchema.index({ publishDate: 1, expiryDate: 1 });
noticesSchema.index({ isPinned: 1 });
noticesSchema.index({ status: 1, publishDate: -1 });

module.exports = mongoose.model("Notices", noticesSchema);










































































// const mongoose = require("mongoose");

// const noticesSchema = new mongoose.Schema(
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
//     instituteId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "institutes_master",
//       required: true,
//     },
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       refPath: "createdByModel",
//       required: true,
//     },
//     createdByModel: {
//       type: String,
//       required: true,
//       enum: ["institute_admins", "TeachersMaster"],
//     },
//     createdByRole: {
//       type: String,
//       required: true,
//       enum: ["institute_admin", "teacher"],
//     },
//     audience: {
//       type: {
//         type: String,
//         required: true,
//         enum: [
//           "all",
//           "teachers",
//           "students",
//           "specific-classes",
//           "specific-users",
//         ],
//       },
//       classIds: {
//         type: [mongoose.Schema.Types.ObjectId],
//         ref: "ClassesMaster",
//         default: null,
//       },
//       sectionIds: {
//         type: [mongoose.Schema.Types.ObjectId],
//         ref: "ClassSections",
//         default: null,
//       },
//       batchIds: {
//         type: [mongoose.Schema.Types.ObjectId],
//         ref: "CoachingBatches",
//         default: null,
//       },
//       studentIds: {
//         type: [mongoose.Schema.Types.ObjectId],
//         ref: "StudentsMaster",
//         default: null,
//       },
//       teacherIds: {
//         type: [mongoose.Schema.Types.ObjectId],
//         ref: "TeachersMaster",
//         default: null,
//       },
//     },
//     category: {
//       type: String,
//       required: true,
//       enum: ["urgent", "academic", "events", "news"],
//     },
//     isPinned: {
//       type: Boolean,
//       default: false,
//     },
//     publishDate: {
//       type: Date,
//       default: null,
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
//     collection: "notices",
//   }
// );

// // Indexes as per schema
// noticesSchema.index({ instituteId: 1, status: 1 });
// noticesSchema.index({ createdBy: 1, createdByRole: 1 });
// noticesSchema.index({ "audience.classIds": 1 });
// noticesSchema.index({ publishDate: 1, expiryDate: 1 });
// noticesSchema.index({ isPinned: 1 });
// noticesSchema.index({ status: 1, publishDate: -1 });

// module.exports = mongoose.model("Notices", noticesSchema);