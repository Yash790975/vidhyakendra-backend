const mongoose = require("mongoose");

const feeHeadSchema = new mongoose.Schema( 
  {
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
    frequency: {
      type: String,
      required: true,
      enum: ["one_time", "monthly", "quarterly", "half_yearly", "annual"],
    },
    mandatory: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const feeStructureSchema = new mongoose.Schema(
  {
    institute_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "institutes_master",
      required: true,
    },
    academic_year: {
      type: String,
      default: null,
    },
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassesMaster",
      default: null, 
    },
    section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassSections",
      default: null,
    },
    // Coaching-compatible: batch_id links fee structure to a coaching batch
    batch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CoachingBatches",
      default: null,
    },
    fee_heads: {
      type: [feeHeadSchema],
      required: true,
    },
    total_annual_amount: {
      type: mongoose.Types.Decimal128,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    collection: "fee_structures",
    toJSON: {
      transform(doc, ret) {
        if (ret.total_annual_amount) {
          ret.total_annual_amount = parseFloat(ret.total_annual_amount.toString());
        }
        if (Array.isArray(ret.fee_heads)) {
          ret.fee_heads = ret.fee_heads.map((head) => ({
            ...head,
            amount: head.amount ? parseFloat(head.amount.toString()) : head.amount,
          }));
        }
        return ret;
      },
    },
    toObject: {
      transform(doc, ret) {
        if (ret.total_annual_amount) {
          ret.total_annual_amount = parseFloat(ret.total_annual_amount.toString());
        }
        if (Array.isArray(ret.fee_heads)) {
          ret.fee_heads = ret.fee_heads.map((head) => ({
            ...head,
            amount: head.amount ? parseFloat(head.amount.toString()) : head.amount,
          }));
        }
        return ret;
      },
    },
  }
);

// Auto-calculate total_annual_amount before saving
feeStructureSchema.pre("save", function (next) {
  const frequencyMultiplier = {
    one_time: 1,
    monthly: 12,
    quarterly: 4,
    half_yearly: 2,
    annual: 1,
  };

  if (Array.isArray(this.fee_heads) && this.fee_heads.length > 0) {
    const total = this.fee_heads.reduce((sum, head) => {
      const amount = parseFloat(head.amount?.toString() || "0");
      const multiplier = frequencyMultiplier[head.frequency] || 1;
      return sum + amount * multiplier;
    }, 0);

    this.total_annual_amount = total;
  }

  next();
});

feeStructureSchema.index({ institute_id: 1, class_id: 1, academic_year: 1 });
feeStructureSchema.index({ institute_id: 1, batch_id: 1, academic_year: 1 });
feeStructureSchema.index({ status: 1 });

module.exports = mongoose.model("FeeStructure", feeStructureSchema);
