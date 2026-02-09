const mongoose = require('mongoose');

const subscriptionPlanVariantSchema = new mongoose.Schema(
  {
    plan_master_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubscriptionPlanMaster', 
      // ref: 'subscription_plan_master', 
      required: [true, 'Plan master ID is required'],
    },

    applicable_for: { 
      type: String,
      required: [true, 'Applicable for is required'],
      enum: {
        values: ['school', 'coaching', 'both'],
        message: '{VALUE} is not a valid institute type', 
      },
    },
 
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },

    discount_percentage: {
      type: mongoose.Schema.Types.Decimal128, //decimal123 is used for precise percentage values
      default: 0,
      min: [0, 'Discount percentage cannot be negative'],
      max: [100, 'Discount percentage cannot exceed 100'],
    },

    features: {
      type: Object,
      default: {},
    },

    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "subscription_plan_variants"
  }
);

// Indexes
subscriptionPlanVariantSchema.index(
  { plan_master_id: 1, applicable_for: 1 },
  { unique: true }
);
subscriptionPlanVariantSchema.index({ applicable_for: 1 });
subscriptionPlanVariantSchema.index({ is_active: 1 });

// ✅ Virtual for discounted price
subscriptionPlanVariantSchema.virtual('discounted_price').get(function () {
  const price = this.price ? Number(this.price.toString()) : 0;
  const discount = this.discount_percentage
    ? Number(this.discount_percentage.toString())
    : 0;

  return price - (price * discount) / 100;
});

// ✅ Convert Decimal128 → Number in API responses
subscriptionPlanVariantSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    if (ret.price) {
      ret.price = Number(ret.price.toString());
    }

    if (ret.discount_percentage) {
      ret.discount_percentage = Number(ret.discount_percentage.toString());
    }

    return ret;
  }, 
});

subscriptionPlanVariantSchema.set('toObject', {
  virtuals: true,
});

const SubscriptionPlanVariant = mongoose.model(
  'SubscriptionPlanVariant',
  // 'subscription_plan_variants',
  subscriptionPlanVariantSchema
);

module.exports = SubscriptionPlanVariant;

