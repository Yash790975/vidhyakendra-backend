const mongoose = require("mongoose");

const teacherBankDetailsSchema = new mongoose.Schema(
  {
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
        ref: "TeachersMaster", 

      required: true, 
    },
    account_holder_name: {      
      type: String,
      required: true,
    },
    bank_name: {    
      type: String,
    },
    branch_name: {
      type: String,
    },  
    account_type: {
      type: String,
      enum: ["savings", "current", "salary", "other"],
      default: "savings",
    },
    account_number: {
      type: String,
      required: true,
    },
    ifsc_code: {
      type: String,
      required: true,
    },
    upi_id: {
      type: String,
      default: null,
    },
    is_primary: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "teacher_bank_details"
  }
);

teacherBankDetailsSchema.index({ teacher_id: 1 });
teacherBankDetailsSchema.index({ is_primary: 1 });

module.exports = mongoose.model(
  "TeacherBankDetails",
  teacherBankDetailsSchema
);