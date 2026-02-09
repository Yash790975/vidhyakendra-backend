const mongoose = require("mongoose");

const studentAddressesSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentsMaster",
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
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "student_addresses",
  }
);

// Indexes
studentAddressesSchema.index({ student_id: 1 });
studentAddressesSchema.index({ address_type: 1 });

// Compound index for unique address type per student
studentAddressesSchema.index(
  { student_id: 1, address_type: 1 },
  { unique: true }
);

module.exports = mongoose.model("StudentAddresses", studentAddressesSchema);