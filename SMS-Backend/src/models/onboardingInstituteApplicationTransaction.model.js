const mongoose = require('mongoose');

const onboardingInstituteApplicationTransactionSchema = new mongoose.Schema(
  {
    reference_id: {
      type: String,  
      required: true, 
      unique: true,
      index: true
    },

    onboarding_basic_info_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OnboardingBasicInformation', 
      // ref: 'onboarding_basic_information',
      required: true
    },

    subscription_plan_variant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubscriptionPlanVariant',  
      // ref: 'subscription_plan_variants', 
      required: true
    }, 
 
    amount: { 
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 0
    },

    currency: {
      type: String,
      default: 'INR'
    },

    payment_gateway: {
      type: String
    },

    payment_transaction_id: {
      type: String
    },

    payment_status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'refunded'],
      required: true,
      default: 'pending'
    },

    application_status: {
      type: String,
      enum: [
        'payment_received',
        'documents_under_review',
        'approved',
        'rejected',
        'account_activated'
      ],
      required: true,
      default: 'payment_received'
    },

    receipt_url: {
      type: String
    }, 

    is_active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    collection: 'onboarding_institute_application_transactions'
  }
);

/* ----------------------------------
   ✅ Decimal128 → Number conversion
----------------------------------- */

onboardingInstituteApplicationTransactionSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    if (ret.amount) {
      ret.amount = Number(ret.amount.toString());
    }
    return ret;
  }
});

onboardingInstituteApplicationTransactionSchema.set('toObject', {
  virtuals: true
});

module.exports = mongoose.model(
  'onboarding_institute_application_transactions',
  onboardingInstituteApplicationTransactionSchema
);

