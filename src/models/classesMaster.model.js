const mongoose = require("mongoose");

const classesMasterSchema = new mongoose.Schema(
  {
    institute_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "institutes_master",
      required: true,
    },
    class_name: {
      type: String,
      required: true,
      description: "School: 10th | Coaching: Mathematics",
    },
    class_type: {
      type: String,
      required: true,
      enum: ["school", "coaching"],
    },
    class_teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeachersMaster",
      default: null,
    },
    class_capacity: {
      type: Number,
      default: null,
    },
    class_level: {
      type: String,
      default: null,
      description: "10, 11, 12 (school only)",
    },
    academic_year: {
      type: String,
      required: true,
      description: "2025-26",
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive", "archived"],
      default: "active",
    },
    archived_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "classes_master",
  }
);

classesMasterSchema.index({ institute_id: 1 });
classesMasterSchema.index({ class_type: 1 });
classesMasterSchema.index({ status: 1 });
classesMasterSchema.index({ academic_year: 1 });

module.exports = mongoose.model("ClassesMaster", classesMasterSchema);

































































// const mongoose = require("mongoose");

// const classesMasterSchema = new mongoose.Schema(    
//   { 
//     institute_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "institutes_master",
//       required: true,
//     },
//     class_name: {
//       type: String,
//       required: true,
//       description: "School: 10th | Coaching: Mathematics",
//     },
//     class_type: {
//       type: String,
//       required: true,
//       enum: ["school", "coaching"],
//     },
//     class_teacher_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "TeachersMaster",
//       default: null,
//       description: "FK → teachers_master._id (null if class has sections)",
//     },
//     class_level: {
//       type: String,
//       default: null,
//       description: "10, 11, 12 (school only)",
//     },
//     academic_year: {
//       type: String,
//       required: true,
//       description: "2025-26",
//     },
//     status: {
//       type: String,
//       required: true,
//       enum: ["active", "inactive", "archived"],
//       default: "active",
//     },
//     archived_at: {
//       type: Date,
//       default: null,
//     },
//   },
//   {
//     timestamps: true,
//     collection: "classes_master",
//   }
// );

// // Indexes
// classesMasterSchema.index({ institute_id: 1 });
// classesMasterSchema.index({ class_type: 1 });
// classesMasterSchema.index({ status: 1 });
// classesMasterSchema.index({ academic_year: 1 });

// module.exports = mongoose.model("ClassesMaster", classesMasterSchema);