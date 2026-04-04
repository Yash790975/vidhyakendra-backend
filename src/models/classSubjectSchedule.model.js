const mongoose = require("mongoose");

const classSubjectScheduleSchema = new mongoose.Schema(
  {
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassesMaster",
      required: true,
    },

    section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassSections",
      default: null,
    },

    batch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CoachingBatches",
      default: null,
    },

    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subjects_master",
      required: true,
    },

    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeachersMaster",
      default: null,
    },

    academic_year: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}$/, "Format must be YYYY-YY (e.g., 2025-26)"],
    },

    day_of_week: {
      type: String,
      enum: ["mon", "tue", "wed", "thu", "fri", "sat"],
      required: true,
    },

    start_time: {
      type: String,
      required: true,
    },

    end_time: {
      type: String,
      required: true,
    },

    room_number: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "class_subject_schedule",
  }
);


// 🔥 Conditional Validation (batch vs section)
classSubjectScheduleSchema.pre("validate", function (next) {
  if (!this.batch_id && !this.section_id) {
    return next(new Error("Either batch_id or section_id is required"));
  }

  if (this.batch_id && this.section_id) {
    return next(new Error("Only one of batch_id or section_id should be provided"));
  }

  next();
});


//  Optimized Indexes

// Basic indexes
classSubjectScheduleSchema.index({ class_id: 1, academic_year: 1 });
classSubjectScheduleSchema.index({ teacher_id: 1, day_of_week: 1 });

// Coaching (batch आधारित)
classSubjectScheduleSchema.index(
  {
    class_id: 1,
    batch_id: 1,
    subject_id: 1,
    day_of_week: 1,
    start_time: 1,
    academic_year: 1,
  },
  {
    unique: true,
    partialFilterExpression: { batch_id: { $type: "objectId" } },
  }
);

// School (section आधारित)
classSubjectScheduleSchema.index(
  {
    class_id: 1,
    section_id: 1,
    subject_id: 1,
    day_of_week: 1,
    start_time: 1,
    academic_year: 1,
  },
  {
    unique: true,
    partialFilterExpression: { section_id: { $type: "objectId" } },
  }
);


module.exports =
  mongoose.models.ClassSubjectSchedule ||
  mongoose.model("ClassSubjectSchedule", classSubjectScheduleSchema);







































































// const mongoose = require("mongoose");

// const classSubjectScheduleSchema = new mongoose.Schema(
//   {
//     class_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "ClassesMaster",
//       required: true,
//     },
//     section_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "ClassSections",
//       default: null,
//     },
//     batch_id: {                                    
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "CoachingBatches",
//       default: null,
//     },
//     subject_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "subjects_master",
//       required: true,
//     },
//     teacher_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "TeachersMaster",
//       default: null,
//     },
//     academic_year: {
//       type: String,
//       required: true,
//       match: [
//         /^\d{4}-\d{2}$/,
//         "academic_year must be in format YYYY-YY (e.g., 2025-26)",
//       ],
//     },
//     day_of_week: {
//       type: String,
//       enum: ["mon", "tue", "wed", "thu", "fri", "sat", null],
//       default: null,
//     },
//     start_time: {
//       type: String,
//       required: true,
//     },
//     end_time: {
//       type: String,
//       required: true,
//     },
//     room_number: {
//       type: String,
//       default: null,
//     }, 
//     status: {
//       type: String,
//       enum: ["active", "inactive"],
//       default: "active",
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//     collection: "class_subject_schedule",
//   }
// );

// // Indexes
// classSubjectScheduleSchema.index({ class_id: 1 });
// classSubjectScheduleSchema.index({ section_id: 1 });
// classSubjectScheduleSchema.index({ batch_id: 1 });          
// classSubjectScheduleSchema.index({ subject_id: 1 });
// classSubjectScheduleSchema.index({ teacher_id: 1 });
// classSubjectScheduleSchema.index({ day_of_week: 1 });
// classSubjectScheduleSchema.index({ academic_year: 1 });
// classSubjectScheduleSchema.index({ status: 1 });

// // Compound indexes
// classSubjectScheduleSchema.index({ class_id: 1, academic_year: 1 });
// classSubjectScheduleSchema.index({ batch_id: 1, academic_year: 1 }); 
// classSubjectScheduleSchema.index({ teacher_id: 1, day_of_week: 1 });

// module.exports =
//   mongoose.models.ClassSubjectSchedule ||
//   mongoose.model("ClassSubjectSchedule", classSubjectScheduleSchema);






































































// const mongoose = require("mongoose");

// const classSubjectScheduleSchema = new mongoose.Schema(
//   {
//     class_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "ClassesMaster",
//       required: true,
//     }, 

//     section_id: { 
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "ClassSections",
//       default: null,
//     },

//     subject_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "subjects_master",
//       required: true,
//     },

//     teacher_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "TeachersMaster",
//       default: null,
//     },

//     
//     academic_year: {
//       type: String,
//       required: true,
//       match: [/^\d{4}-\d{2}$/, "academic_year must be in format YYYY-YY (e.g., 2025-26)"],
//     },

//     day_of_week: {
//       type: String,
//       enum: ["mon", "tue", "wed", "thu", "fri", "sat", null],
//       default: null,
//     },

//     start_time: {
//       type: String,
//       required: true,
//     },
    
//     end_time: {
//       type: String,
//       required: true,
//     },

//     //  RENAMED
//     room_number: {
//       type: String,
//       default: null,
//     },

//     status: {
//       type: String,
//       enum: ["active", "inactive"],
//       default: "active",
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//     collection: "class_subject_schedule",
//   }
// );

// //  Indexes
// classSubjectScheduleSchema.index({ class_id: 1 });
// classSubjectScheduleSchema.index({ section_id: 1 });
// classSubjectScheduleSchema.index({ subject_id: 1 });
// classSubjectScheduleSchema.index({ teacher_id: 1 });
// classSubjectScheduleSchema.index({ day_of_week: 1 });
// classSubjectScheduleSchema.index({ academic_year: 1 });
// classSubjectScheduleSchema.index({ status: 1 });

// //  SAFE EXPORT (prevents OverwriteModelError)
// module.exports =
//   mongoose.models.ClassSubjectSchedule ||
//   mongoose.model("ClassSubjectSchedule", classSubjectScheduleSchema);


