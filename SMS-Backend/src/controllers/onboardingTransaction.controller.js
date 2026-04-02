const transactionService = require('../services/onboardingTransaction.service');
const {
  createTransactionValidation,
  updateTransactionValidation,  
  updatePaymentStatusValidation,
  updateApplicationStatusValidation
} = require('../validations/onboardingTransaction.validation');
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

    const transaction = await transactionService.createTransaction(req.body);

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
    const transactions = await transactionService.getAllTransactions();

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
    const transaction = await transactionService.getTransactionById(req.params.id);

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

const getTransactionByReferenceId = async (req, res) => {
  try {
    const transaction = await transactionService.getTransactionByReferenceId(
      req.params.reference_id
    );

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

const getTransactionsByOnboardingId = async (req, res) => {
  try {
    const transactions = await transactionService.getTransactionsByOnboardingId(
      req.params.onboarding_id
    );

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

const getTransactionsByPaymentStatus = async (req, res) => {
  try {
    const transactions = await transactionService.getTransactionsByPaymentStatus(
      req.params.payment_status
    );

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

const getTransactionsByApplicationStatus = async (req, res) => {
  try {
    const transactions = await transactionService.getTransactionsByApplicationStatus(
      req.params.application_status
    );

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

    const transaction = await transactionService.updateTransaction(
      req.params.id,
      req.body
    );

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

const updatePaymentStatus = async (req, res) => {
  try {
    const { error } = updatePaymentStatusValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const transaction = await transactionService.updatePaymentStatus(
      req.params.id,
      req.body
    );

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
      message: 'Payment status updated successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while updating payment status'
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { error } = updateApplicationStatusValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const transaction = await transactionService.updateApplicationStatus(
      req.params.id,
      req.body.application_status
    );

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
      message: 'Application status updated successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while updating application status'
    });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await transactionService.deleteTransaction(req.params.id);

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


// const getTransactionsWithFullDetails = async (req, res) => {
//   try {
//     const filter = {};

//     // Optional filters
//     if (req.query.payment_status) {
//       filter.payment_status = req.query.payment_status;
//     }

//     if (req.query.application_status) {
//       filter.application_status = req.query.application_status;
//     }

//     if (req.query.onboarding_basic_info_id) {
//       filter.onboarding_basic_info_id = req.query.onboarding_basic_info_id;
//     }

//     const transactions =
//       await transactionService.getTransactionWithFullDetails(filter);

//     return res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: transactions,
//       message: 'Transactions retrieved with full details successfully'
//     });
//   } catch (err) {
//     return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: null,
//       message:
//         err.message ||
//         'Something went wrong while fetching transactions with full details'
//     });
//   }
// };

const getTransactionsWithFullDetails = async (req, res) => {
  try {
    const filter = {};

    // Optional filters (only affect TRANSACTIONS)
    if (req.query.payment_status) {
      filter.payment_status = req.query.payment_status;
    }

    if (req.query.application_status) {
      filter.application_status = req.query.application_status;
    }

    if (req.query.onboarding_basic_info_id) {
      filter.onboarding_basic_info_id =
        req.query.onboarding_basic_info_id;
    }

    const result =
      await transactionService.getTransactionWithFullDetails(filter);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result,
      count: result.length,
      message:
        'Transactions retrieved with full details successfully'
    });
  } catch (err) {
    return res.status(
      err.statusCode || statusCode.INTERNAL_SERVER_ERROR
    ).json({
      success: false,
      isException: true,
      statusCode:
        err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message:
        err.message ||
        'Something went wrong while fetching transactions with full details'
    });
  }
};


const getTransactionWithFullDetailsByOnboardingBasicInfoId = async (req, res) => {
  try {
    const { onboarding_basic_info_id } = req.params;

    const response =
      await transactionService.getTransactionWithFullDetailsByOnboardingBasicInfoId(
        onboarding_basic_info_id
      );

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: response,
      message: response.hasTransaction
        ? 'Transactions retrieved successfully'
        : 'No transaction found, onboarding details retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message:
        err.message ||
        'Something went wrong while fetching onboarding transaction details'
    });
  }
};



module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  getTransactionByReferenceId,
  getTransactionsByOnboardingId,
  getTransactionsByPaymentStatus,
  getTransactionsByApplicationStatus,
  updateTransaction,
  updatePaymentStatus,
  updateApplicationStatus,
  deleteTransaction,
  getTransactionsWithFullDetails ,
  getTransactionWithFullDetailsByOnboardingBasicInfoId 
}; 