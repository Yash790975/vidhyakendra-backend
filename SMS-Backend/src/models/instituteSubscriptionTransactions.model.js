const mongoose = require('mongoose');

const instituteSubscriptionTransactionsSchema = new mongoose.Schema(
  {
    institute_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'institutes_master',
      required: true
    }, 
    subscription_plan_variant_id: {
      type: mongoose.Schema.Types.ObjectId,
      // ref: 'subscription_plan_variants',  
      ref: 'SubscriptionPlanVariant', 
    },
    amount: {   
      type: mongoose.Schema.Types.Decimal128,
      required: true  
    },
    payment_status: {
      type: String,
      enum: ['success', 'failed', 'refunded'],
      required: true
    },
    payment_gateway: {
      type: String
    },
    transaction_id: {
      type: String
    },
    receipt_url: {
      type: String
    },
    paid_at: {
      type: Date
    },
    subscription_start_date: {
      type: Date
    },
    subscription_end_date: {
      type: Date
    },
    is_active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    collection: 'institute_subscription_transactions'
  }
);


instituteSubscriptionTransactionsSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    if (ret.amount) {
      ret.amount = Number(ret.amount.toString());
    }
    return ret;
  }
});

instituteSubscriptionTransactionsSchema.set('toObject', {
  virtuals: true
});

module.exports = mongoose.model(
  'institute_subscription_transactions',
  instituteSubscriptionTransactionsSchema
);