const mongoose = require('mongoose');

const teacherSalaryStructureSchema = new mongoose.Schema({
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeachersMaster",   
    required: true 
  }, 
  salary_type: {
    type: String,
    enum: ['fixed_monthly', 'per_lecture', 'hourly', 'percentage', 'hybrid'],
    required: true
  },
  pay_frequency: {
    type: String,
    enum: ['monthly', 'weekly', 'bi_weekly', 'per_session'],
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  basic_salary: {
    type: Number,
    default: null
  },
  hra: {
    type: Number,
    default: null
  },
  da: {
    type: Number,
    default: null
  },
  conveyance_allowance: {
    type: Number,
    default: null
  },
  medical_allowance: { 
    type: Number,
    default: null
  },
  per_lecture_rate: {
    type: Number,
    default: null
  },
  hourly_rate: {
    type: Number,
    default: null
  },
  revenue_percentage: {
    type: Number,
    default: null
  },
  incentive_amount: {
    type: Number,
    default: null
  },
  bonus_amount: {
    type: Number,
    default: null
  },
  max_lectures_per_month: {
    type: Number,
    default: null
  },
  max_hours_per_month: {
    type: Number,
    default: null
  },
  pf_applicable: {
    type: Boolean,
    default: false
  },
  pf_percentage: {
    type: Number,
    default: null
  },
  tds_applicable: {
    type: Boolean,
    default: false
  },
  tds_percentage: {
    type: Number,
    default: null
  },
  other_deductions: [{
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  }],
  effective_from: {
    type: Date,
    required: true
  },
  effective_to: {
    type: Date,
    default: null
  },
  approved_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'institute_admins',
    default: null
  },
  approved_at: {
    type: Date,
    default: null
  },
  remarks: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active',
    required: true
  },
  archived_at: {
    type: Date,
    default: null
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
teacherSalaryStructureSchema.index({ teacher_id: 1 });
teacherSalaryStructureSchema.index({ status: 1 });
teacherSalaryStructureSchema.index({ effective_from: 1 });

module.exports = mongoose.model('teacher_salary_structure', teacherSalaryStructureSchema);    