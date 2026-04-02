const mongoose = require('mongoose'); 

const instituteDetailsSchema = new mongoose.Schema(
  {
    institute_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'institutes_master',
      required: true
    },  
    school_board: {  
      type: String
    },
    school_type: {
      type: String,
      enum: ['private', 'government', 'public']
    },
    classes_offered: {
      type: [String]
    },
    courses_offered: {
      type: [String]
    },
    medium: {
      type: String,
      enum: ['english', 'hindi', 'other']
    },
    approx_students_range: {
      type: String,
      enum: ['1-100', '101-250', '251-500', '500-1000', '1000+']
    }
  },
  {
    timestamps: true,
    collection: 'institute_details'
  }
);

module.exports = mongoose.model('institute_details', instituteDetailsSchema);