const mongoose = require("mongoose");

const teacherAddressesSchema = new mongoose.Schema(
  {
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      // ref: "teachers_master", 
      ref: "TeachersMaster", 
      required: true,
    },
    address_type: {
      type: String,
      required: true,
      enum: ["current", "permanent"],
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    pincode: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "teacher_addresses"
  }
);

// Index for faster queries
teacherAddressesSchema.index({ teacher_id: 1, address_type: 1 });

module.exports = mongoose.model("TeacherAddresses", teacherAddressesSchema); 