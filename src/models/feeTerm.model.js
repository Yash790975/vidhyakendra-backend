const mongoose = require("mongoose");

const feeTermSchema = new mongoose.Schema(
  {
    institute_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "institutes_master",
      required: true,
    },
    academic_year: {
      type: String,
      required: true,
    },
    term_order: {
      type: Number,
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    due_date: {
      type: Date,
      required: true,
    },
    late_fee_amount: {
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
    collection: "fee_terms",
    toJSON: {
      transform(doc, ret) {
        if (ret.late_fee_amount) {
          ret.late_fee_amount = parseFloat(ret.late_fee_amount.toString());
        }
        return ret;
      },
    },
    toObject: {
      transform(doc, ret) {
        if (ret.late_fee_amount) {
          ret.late_fee_amount = parseFloat(ret.late_fee_amount.toString());
        }
        return ret;
      },
    },
  }
);

feeTermSchema.index({ institute_id: 1, academic_year: 1 });
feeTermSchema.index({ institute_id: 1, term_order: 1 });

module.exports = mongoose.model("FeeTerm", feeTermSchema);