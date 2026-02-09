const mongoose = require("mongoose");

const teacherEmergencyContactsSchema = new mongoose.Schema(
  {
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeachersMaster", 

      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    relation: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "teacher_emergency_contacts"
  }
);

teacherEmergencyContactsSchema.index({ teacher_id: 1 });

module.exports = mongoose.model(
  "TeacherEmergencyContacts",
  teacherEmergencyContactsSchema
);