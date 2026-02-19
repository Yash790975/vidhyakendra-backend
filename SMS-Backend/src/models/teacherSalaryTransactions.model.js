// models/teacherSalaryTransactions.model.js
const mongoose = require('mongoose');

const teacherSalaryTransactionsSchema = new mongoose.Schema({
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeachersMaster",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  payment_month: {
    type: String,
    required: true // Format: YYYY-MM
  },
  payment_date: {
    type: Date,
    default: null
  },
  payment_mode: {
    type: String,
    enum: ['bank_transfer', 'upi', 'cash'],
    default: null
  },
  reference_id: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    required: true,
    default: 'pending'
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes
teacherSalaryTransactionsSchema.index({ teacher_id: 1 });
teacherSalaryTransactionsSchema.index({ payment_month: 1 });
teacherSalaryTransactionsSchema.index({ status: 1 });

module.exports = mongoose.model('teacher_salary_transactions', teacherSalaryTransactionsSchema);