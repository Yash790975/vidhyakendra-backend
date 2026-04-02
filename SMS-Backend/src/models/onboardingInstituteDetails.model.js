const mongoose = require('mongoose');

const onboardingInstituteDetailsSchema = new mongoose.Schema(
  {
    onboarding_basic_info_id: {  
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OnboardingBasicInformation',
      // ref: 'onboarding_basic_information',
      required: [true, 'Onboarding basic info ID is required'],
      unique: true,
    },
    school_board: {
      type: String,
      trim: true,
      enum: {
        values: ['CBSE', 'ICSE', 'State Board', 'Other'],
        message: '{VALUE} is not a valid school board',
      },
    },
    school_type: {
      type: String,
      enum: {
        values: ['private', 'government', 'public'],
        message: '{VALUE} is not a valid school type',
      },
    },
    classes_offered: {
      type: [String],
      required: [true, 'Classes offered is required'],
      validate: {
        validator: function(v) {
          return v && v.length > 0;
        },
        message: 'At least one class must be offered',
      },
    },
    medium: {
      type: String,
      required: [true, 'Medium is required'],
      enum: {
        values: ['english', 'hindi', 'other'],
        message: '{VALUE} is not a valid medium',
      },
    },
    courses_offered: { 
      type: [String],
      default: [],
    },
    approx_students_range: {
      type: String,
      required: [true, 'Approximate students range is required'],
      enum: {
        values: ['1-100', '101-250', '251-500', '500-1000', '1000+'],
        message: '{VALUE} is not a valid students range',
      },
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "onboarding_institute_details"
  }
);

// Indexes
onboardingInstituteDetailsSchema.index({ onboarding_basic_info_id: 1 }, { unique: true });
onboardingInstituteDetailsSchema.index({ school_board: 1 });
onboardingInstituteDetailsSchema.index({ school_type: 1 });
onboardingInstituteDetailsSchema.index({ medium: 1 });
onboardingInstituteDetailsSchema.index({ approx_students_range: 1 });
onboardingInstituteDetailsSchema.index({ is_active: 1 }); 

// Transform to include virtuals
onboardingInstituteDetailsSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    return ret;
  }
});

onboardingInstituteDetailsSchema.set('toObject', { virtuals: true });

const OnboardingInstituteDetails = mongoose.model(
  'OnboardingInstituteDetails',
  onboardingInstituteDetailsSchema
);

module.exports = OnboardingInstituteDetails;