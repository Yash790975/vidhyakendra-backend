const mongoose = require('mongoose');

const instituteBasicInformationSchema = new mongoose.Schema(
  {
    institute_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'institutes_master',
      required: true
    },
    owner_name: { 
      type: String,
      required: true
    },
    designation: {
      type: String
    },
    email: {
      type: String,
      required: true
    },
    mobile: {
      type: String,
      required: true
    },
    address: {
      type: String
    },
    email_verified: {
      type: Boolean,
      default: false
    },
    mobile_verified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    collection: 'institute_basic_information'
  }
);

module.exports = mongoose.model(
  'institute_basic_information',
  instituteBasicInformationSchema
);