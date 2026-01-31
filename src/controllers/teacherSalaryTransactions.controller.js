
const teacherSalaryTransactionsService = require('../services/teacherSalaryTransactions.service');
const {
  createTransactionValidation,
  updateTransactionValidation
} = require('../validations/teacherSalaryTransactions.validation');
const statusCode = require('../enums/statusCode');

const createTransaction = async (req, res) => {
  try {
    const { error } = createTransactionValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const transaction = await teacherSalaryTransactionsService.createTransaction(req.body);

    return res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: transaction,
      message: 'Transaction created successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while creating transaction'
    });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await teacherSalaryTransactionsService.getAllTransactions();

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: transactions,
      message: 'Transactions retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching transactions'
    });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const transaction = await teacherSalaryTransactionsService.getTransactionById(req.params.id);

    if (!transaction) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Transaction not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: transaction,
      message: 'Transaction retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching transaction'
    });
  }
};

const getTransactionsByTeacherId = async (req, res) => {
  try {
    const transactions = await teacherSalaryTransactionsService.getTransactionsByTeacherId(req.params.teacher_id);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: transactions,
      message: 'Transactions retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching transactions'
    });
  }
};

const getTransactionsByMonth = async (req, res) => {
  try {
    const transactions = await teacherSalaryTransactionsService.getTransactionsByMonth(req.params.month);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: transactions,
      message: 'Transactions retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching transactions'
    });
  }
};

const getTransactionsByStatus = async (req, res) => {
  try {
    const transactions = await teacherSalaryTransactionsService.getTransactionsByStatus(req.params.status);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: transactions,
      message: 'Transactions retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching transactions'
    });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { error } = updateTransactionValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const transaction = await teacherSalaryTransactionsService.updateTransaction(req.params.id, req.body);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: transaction,
      message: 'Transaction updated successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while updating transaction'
    });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const result = await teacherSalaryTransactionsService.deleteTransaction(req.params.id);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: result,
      message: 'Transaction deleted successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while deleting transaction'
    });
  }
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


 































































// const teacherSalaryTransactionsService = require('../services/teacherSalaryTransactions.service');
// const {
//   createTransactionValidation,
//   updateTransactionValidation
// } = require('../validations/teacherSalaryTransactions.validation');
// const statusCode = require('../enums/statusCode');

// const createTransaction = async (req, res) => {
//   try {
//     const { error } = createTransactionValidation.validate(req.body);
//     if (error) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: null,
//         message: error.details[0].message
//       });
//     }

//     const transaction = await teacherSalaryTransactionsService.createTransaction(req.body);

//     return res.status(statusCode.CREATED).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.CREATED,
//       result: transaction,
//       message: 'Transaction created successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while creating transaction'
//     });
//   }
// };

// const getAllTransactions = async (req, res) => {
//   try {
//     const transactions = await teacherSalaryTransactionsService.getAllTransactions();

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: transactions,
//       message: 'Transactions retrieved successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while fetching transactions'
//     });
//   }
// };

// const getTransactionById = async (req, res) => {
//   try {
//     const transaction = await teacherSalaryTransactionsService.getTransactionById(req.params.id);

//     if (!transaction) {
//       return res.status(statusCode.NOT_FOUND).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.NOT_FOUND,
//         result: null,
//         message: 'Transaction not found'
//       });
//     }

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: transaction,
//       message: 'Transaction retrieved successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while fetching transaction'
//     });
//   }
// };

// const getTransactionsByTeacherId = async (req, res) => {
//   try {
//     const transactions = await teacherSalaryTransactionsService.getTransactionsByTeacherId(req.params.teacherId);

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: transactions,
//       message: 'Transactions retrieved successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while fetching transactions'
//     });
//   }
// };

// const getTransactionsByMonth = async (req, res) => {
//   try {
//     const transactions = await teacherSalaryTransactionsService.getTransactionsByMonth(req.params.month);

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: transactions,
//       message: 'Transactions retrieved successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while fetching transactions'
//     });
//   }
// };

// const getTransactionsByStatus = async (req, res) => {
//   try {
//     const transactions = await teacherSalaryTransactionsService.getTransactionsByStatus(req.params.status);

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: transactions,
//       message: 'Transactions retrieved successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while fetching transactions'
//     });
//   }
// };

// const updateTransaction = async (req, res) => {
//   try {
//     const { error } = updateTransactionValidation.validate(req.body);
//     if (error) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: null,
//         message: error.details[0].message
//       });
//     }

//     const transaction = await teacherSalaryTransactionsService.updateTransaction(req.params.id, req.body);

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: transaction,
//       message: 'Transaction updated successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while updating transaction'
//     });
//   }
// };

// const deleteTransaction = async (req, res) => {
//   try {
//     const result = await teacherSalaryTransactionsService.deleteTransaction(req.params.id);

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: result,
//       message: 'Transaction deleted successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message: err.message || 'Something went wrong while deleting transaction'
//     });
//   }
// };

// module.exports = {
//   createTransaction,
//   getAllTransactions,
//   getTransactionById,
//   getTransactionsByTeacherId,
//   getTransactionsByMonth,
//   getTransactionsByStatus,
//   updateTransaction,
//   deleteTransaction
// };