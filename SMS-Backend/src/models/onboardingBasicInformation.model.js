const mongoose = require('mongoose');

const onboardingBasicInformationSchema = new mongoose.Schema(
  {
    institute_name: {
      type: String,
      required: [true, 'Institute name is required'],
      trim: true,
    },
    institute_type: { 
      type: String,
      required: [true, 'Institute type is required'],
      enum: {
        values: ['school', 'coaching', 'both'],
        message: '{VALUE} is not a valid institute type',
      },
    },
    owner_name: {
      type: String,
      required: [true, 'Owner name is required'],
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    mobile_number_verified: {
      type: Boolean,
      default: false,
    },
    is_archived: {
      type: Boolean,
      default: false,
      description: 'Onboarding completed and locked',
    },
    archived_at: {
      type: Date,
      default: null,
      description: 'When onboarding was completed',
    },
    is_active: {
      type: Boolean,
      default: true,   
    },
  },
  { 
    timestamps: true,
    collection: "onboarding_basic_information" 
  }
);

// Indexes 
onboardingBasicInformationSchema.index({ email: 1 });
onboardingBasicInformationSchema.index({ mobile: 1 });
onboardingBasicInformationSchema.index({ institute_type: 1 });
onboardingBasicInformationSchema.index({ is_active: 1 });

// Transform to include virtuals and convert types
onboardingBasicInformationSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    return ret;
  }
});

onboardingBasicInformationSchema.set('toObject', { virtuals: true });

const OnboardingBasicInformation = mongoose.model(
  'OnboardingBasicInformation',
  onboardingBasicInformationSchema
);

module.exports = OnboardingBasicInformation;