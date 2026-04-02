
const TeacherSalaryTransactions = require('../models/teacherSalaryTransactions.model');
const statusCode = require('../enums/statusCode');
const CustomError = require('../exceptions/CustomError') 

// const createTransaction = async (data) => {
//   const transaction = new TeacherSalaryTransactions(data);
//   await transaction.save();
  
//   const populated = await TeacherSalaryTransactions.findById(transaction._id)
//     .populate("teacher_id", "full_name teacher_code");
  
//   return populated;
// };


const createTransaction = async (data) => {
  const { teacher_id, payment_month } = data;

  // 🔹 Check if transaction already exists for same teacher & month
  const existingTransaction = await TeacherSalaryTransactions.findOne({
    teacher_id,
    payment_month,
  });

  if (existingTransaction) {
    throw new CustomError(
      `Salary transaction already exists for ${payment_month}`,
      statusCode.BAD_REQUEST
    );
  }

  // 🔹 Create new transaction
  const transaction = new TeacherSalaryTransactions(data);
  await transaction.save();

  // 🔹 Populate teacher details
  const populated = await TeacherSalaryTransactions.findById(transaction._id)
    .populate("teacher_id", "full_name teacher_code");

  return populated;
};

module.exports = {
  createTransaction,
};

const getAllTransactions = async () => {
  const transactions = await TeacherSalaryTransactions.find()
    .populate("teacher_id", "full_name teacher_code")
    .sort({ payment_month: -1 });
  
  return transactions;
};

const getTransactionById = async (id) => {
  const transaction = await TeacherSalaryTransactions.findById(id)
    .populate("teacher_id", "full_name teacher_code");
  
  return transaction;
};

const getTransactionsByTeacherId = async (teacherId) => {
  const transactions = await TeacherSalaryTransactions.find({ teacher_id: teacherId })
    .populate("teacher_id", "full_name teacher_code")
    .sort({ payment_month: -1 });
  
  return transactions;
};

const getTransactionsByMonth = async (month) => {
  const transactions = await TeacherSalaryTransactions.find({ payment_month: month })
    .populate("teacher_id", "full_name teacher_code");
  
  return transactions;
};

const getTransactionsByStatus = async (status) => {
  const transactions = await TeacherSalaryTransactions.find({ status })
    .populate("teacher_id", "full_name teacher_code")
    .sort({ payment_month: -1 });
  
  return transactions;
};

const updateTransaction = async (id, data) => {
  const transaction = await TeacherSalaryTransactions.findById(id);
  if (!transaction) {
    const error = new Error('Transaction not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  Object.assign(transaction, data);
  await transaction.save();

  const updated = await TeacherSalaryTransactions.findById(id)
    .populate("teacher_id", "full_name teacher_code");

  return updated;
};

const deleteTransaction = async (id) => {
  const transaction = await TeacherSalaryTransactions.findByIdAndDelete(id);
  if (!transaction) {
    const error = new Error('Transaction not found');
    error.statusCode = statusCode.NOT_FOUND;
    throw error;
  }

  return { message: 'Transaction deleted successfully' };
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  getTransactionsByTeacherId,
  getTransactionsByMonth,
  getTransactionsByStatus,
  updateTransaction,
  deleteTransaction
};