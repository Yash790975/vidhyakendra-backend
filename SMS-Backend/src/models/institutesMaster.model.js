const mongoose = require('mongoose');

const institutesMasterSchema = new mongoose.Schema(
  {
    institute_code: {
      type: String,
      required: true, 
      unique: true, 
      index: true 
    },
    institute_name: {   
      type: String,
      required: true 
    },
    institute_type: {
      type: String,
      enum: ['school', 'coaching', 'both'],
      required: true,
      index: true
    },
    application_reference_id: {
      type: String
    },
    status: {
      type: String,
      enum: [
        'pending_activation',
        'trial',
        'active',
        'suspended',
        'blocked',
        'expired',
        'archived'
      ],
      required: true,
      default: 'pending_activation',
      index: true
    }
  },
  {
    timestamps: true,
    collection: 'institutes_master'
  }
);

module.exports = mongoose.model('institutes_master', institutesMasterSchema);    