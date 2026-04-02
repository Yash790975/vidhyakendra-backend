const mongoose = require("mongoose");

const feeReceiptSchema = new mongoose.Schema(
  {
    institute_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "institutes_master",
      required: true,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentsMaster", 
      required: true,
    },
    student_fee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentFee",
      required: true,
    },
    term_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeeTerm",
      default: null,
    },
    receipt_number: {
      type: String,
      required: true,
      unique: true,
    },
    amount_paid: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
    payment_method: {
      type: String,
      required: true,
      enum: ["cash", "card", "online", "cheque", "upi"],
    },
    transaction_id: {
      type: String,
      default: null,
    },
    payment_date: {
      type: Date,
      required: true,
    },
    collected_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeachersMaster",
      default: null,
    }, 
    remarks: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
    collection: "fee_receipts",
    toJSON: {
      transform(doc, ret) {
        if (ret.amount_paid) ret.amount_paid = parseFloat(ret.amount_paid.toString());
        return ret;
      },
    },
    toObject: {
      transform(doc, ret) {
        if (ret.amount_paid) ret.amount_paid = parseFloat(ret.amount_paid.toString());
        return ret;
      },
    },
  }
);

feeReceiptSchema.index({ student_id: 1 });
feeReceiptSchema.index({ student_fee_id: 1 });
feeReceiptSchema.index({ institute_id: 1 });
feeReceiptSchema.index({ receipt_number: 1 }, { unique: true });

module.exports = mongoose.model("FeeReceipt", feeReceiptSchema); 