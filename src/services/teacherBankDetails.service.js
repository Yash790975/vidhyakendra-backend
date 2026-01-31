
const TeacherBankDetails = require("../models/teacherBankDetails.model");
const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");

// ============= BANK DETAILS =============  

const createBankDetails = async (bankData) => {

  const existingBankDetails = await TeacherBankDetails.findOne({
    teacher_id: bankData.teacher_id
  });   

  if (existingBankDetails) {
    throw new Error("Bank details already exist for this teacher");
  }

  const bankDetails = new TeacherBankDetails(bankData);
  await bankDetails.save();
  return bankDetails; 
};

const getBankDetailsByTeacherId = async (teacherId) => {
  const bankDetails = await TeacherBankDetails.find({ teacher_id: teacherId })
  .populate("teacher_id", "full_name teacher_code");
  
  return bankDetails;
}; 

const updateBankDetails = async (bankId, updateData) => {
  const bankDetails = await TeacherBankDetails.findByIdAndUpdate(
    bankId,
    updateData,
    { new: true }
  );

  if (!bankDetails) {
    throw new CustomError("Bank details not found", statusCode.NOT_FOUND);
  }

  return bankDetails;
};

const getAllBankDetails = async () => {
  const bankDetails = await TeacherBankDetails.find()
  .populate("teacher_id", "full_name teacher_code");
  return bankDetails;
};

const getBankDetailsById = async (bankId) => {
  const bankDetails = await TeacherBankDetails.findById(bankId)
  .populate("teacher_id", "full_name teacher_code");

  if (!bankDetails) {
    throw new CustomError("Bank details not found", statusCode.NOT_FOUND);
  }

  return bankDetails;
};


const deleteBankDetails = async (bankId) => {
  const bankDetails = await TeacherBankDetails.findByIdAndDelete(bankId);

  if (!bankDetails) {
    throw new CustomError("Bank details not found", statusCode.NOT_FOUND);
  }

  return bankDetails;
};

module.exports = {
  // Bank Details
  createBankDetails,
  getAllBankDetails,
  getBankDetailsById,
  getBankDetailsByTeacherId,
  updateBankDetails,
  deleteBankDetails
};
