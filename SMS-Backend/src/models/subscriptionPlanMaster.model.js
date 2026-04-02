const mongoose = require('mongoose');

const subscriptionPlanMasterSchema = new mongoose.Schema(
  {
   plan_name: {
      type: String,   
      required: [true, 'Plan name is required'],
      unique: true,
      trim: true,
    },
    plan_type: {
      type: String,  
      required: [true, 'Plan type is required'], 
      default: 'subscription',
      trim: true, 
    },
    duration_months: {
      type: Number,
      required: [true, 'Duration in months is required'],
      min: [1, 'Duration must be at least 1 month'],
    },
    description: {
      type: String, 
      trim: true,
    },
    is_active: {
      type: Boolean,
      default: true, 
    },
  },
  {
    timestamps: true,
    collection: "subscription_plan_master" 
  }
);

// Indexes
subscriptionPlanMasterSchema.index({ plan_name: 1 });
subscriptionPlanMasterSchema.index({ is_active: 1 });

const SubscriptionPlanMaster = mongoose.model(
  'SubscriptionPlanMaster',
  subscriptionPlanMasterSchema
);

module.exports = SubscriptionPlanMaster; 