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
    day_of_week: {
      type: String,
      enum: ["mon", "tue", "wed", "thu", "fri", "sat", null],
      default: null,
    },
    start_time: {
      type: String,
      required: true,
    },
    end_time: {
      type: String,
      required: true,
    },
    room_no: {
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

// Indexes
classSubjectScheduleSchema.index({ class_id: 1 });
classSubjectScheduleSchema.index({ section_id: 1 });
classSubjectScheduleSchema.index({ subject_id: 1 });
classSubjectScheduleSchema.index({ teacher_id: 1 });
classSubjectScheduleSchema.index({ day_of_week: 1 });
classSubjectScheduleSchema.index({ status: 1 });

// ✅ SAFE EXPORT (prevents OverwriteModelError)
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
//       description: "FK → class_sections._id (null if no section)",
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
//     day_of_week: {
//       type: String,
//       enum: ["mon", "tue", "wed", "thu", "fri", "sat", null],
//       default: null,
//     },
//     start_time: {
//       type: String,
//       required: true,
//       description: "08:00",
//     },
//     end_time: {
//       type: String,
//       required: true,
//       description: "10:00",
//     },
//     room_no: {
//       type: String,
//       default: null,
//     },
//     status: {
//       type: String,
//       required: true,
//       enum: ["active", "inactive"],
//       default: "active",
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
// classSubjectScheduleSchema.index({ subject_id: 1 });
// classSubjectScheduleSchema.index({ teacher_id: 1 });
// classSubjectScheduleSchema.index({ day_of_week: 1 });
// classSubjectScheduleSchema.index({ status: 1 });

// module.exports = mongoose.model( 
//   "ClassSubjectSchedule", 
//   classSubjectScheduleSchema
// );