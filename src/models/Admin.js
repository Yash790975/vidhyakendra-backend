const mongoose = require('mongoose');   

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Admin name is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"] 
  },
  key: {
    type: String,
    required: [true, "Key is required"],
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: "admin",
      toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
AdminSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("Admin", AdminSchema);
