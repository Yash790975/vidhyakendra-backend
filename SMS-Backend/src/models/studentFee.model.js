const mongoose = require("mongoose");

const feeSnapshotItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    amount: { type: mongoose.Types.Decimal128, required: true },
    frequency: { type: String },
  },
  { _id: false }
);

const studentFeeSchema = new mongoose.Schema(
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
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassesMaster",
      required: true,
    },
    section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassSections",
      default: null,
    },
    academic_year: {
      type: String,
      required: true,
    },
    term_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeeTerm",
      required: true,
    },
    fee_structure_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeeStructure",
      required: true,
    },
    fee_snapshot: {
      type: [feeSnapshotItemSchema],
      required: true,
    },
    total_amount: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
    paid_amount: {
      type: mongoose.Types.Decimal128,
      required: true,
      default: mongoose.Types.Decimal128.fromString("0"),
    },
    due_amount: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
    late_fee_applied: {
      type: mongoose.Types.Decimal128,
      default: null,
    },
    due_date: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "partial", "paid", "overdue"],
      required: true,
      default: "pending",
    },
    is_late_fee_applied: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    collection: "student_fees",
    toJSON: {
      transform(doc, ret) {
        if (ret.total_amount) ret.total_amount = parseFloat(ret.total_amount.toString());
        if (ret.paid_amount != null) ret.paid_amount = parseFloat(ret.paid_amount.toString());
        if (ret.due_amount != null) ret.due_amount = parseFloat(ret.due_amount.toString());
        if (ret.late_fee_applied) ret.late_fee_applied = parseFloat(ret.late_fee_applied.toString());
        if (Array.isArray(ret.fee_snapshot)) {
          ret.fee_snapshot = ret.fee_snapshot.map((item) => ({
            ...item,
            amount: item.amount ? parseFloat(item.amount.toString()) : item.amount,
          }));
        }
        return ret;
      },
    },
    toObject: {
      transform(doc, ret) {
        if (ret.total_amount) ret.total_amount = parseFloat(ret.total_amount.toString());
        if (ret.paid_amount != null) ret.paid_amount = parseFloat(ret.paid_amount.toString());
        if (ret.due_amount != null) ret.due_amount = parseFloat(ret.due_amount.toString());
        if (ret.late_fee_applied) ret.late_fee_applied = parseFloat(ret.late_fee_applied.toString());
        if (Array.isArray(ret.fee_snapshot)) {
          ret.fee_snapshot = ret.fee_snapshot.map((item) => ({
            ...item,
            amount: item.amount ? parseFloat(item.amount.toString()) : item.amount,
          }));
        }
        return ret;
      },
    },
  }
);

studentFeeSchema.index({ student_id: 1, term_id: 1 }, { unique: true });
studentFeeSchema.index({ institute_id: 1, academic_year: 1 });
studentFeeSchema.index({ status: 1 });
studentFeeSchema.index({ student_id: 1, status: 1 });

module.exports = mongoose.model("StudentFee", studentFeeSchema);