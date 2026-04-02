const service = require('../services/subscriptionTransactions.service');
const {
  createSubscriptionTransactionValidation,
  updateSubscriptionTransactionValidation
} = require('../validations/subscriptionTransactions.validation');
const statusCode = require('../enums/statusCode');
 
const createSubscriptionTransaction = async (req, res) => {
  try {
    const { error } = createSubscriptionTransactionValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const transaction = await service.createSubscriptionTransaction(req.body);

    return res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: transaction,
      message: 'Subscription transaction created successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while creating subscription transaction'
    });
  }
};

const getAllSubscriptionTransactions = async (req, res) => {
  try {
    const transactions = await service.getAllSubscriptionTransactions();

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: transactions,
      message: 'Subscription transactions retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching subscription transactions'
    });
  }
};

const getSubscriptionTransactionById = async (req, res) => {
  try {
    const transaction = await service.getSubscriptionTransactionById(req.params.id);

    if (!transaction) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Subscription transaction not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: transaction,
      message: 'Subscription transaction retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching subscription transaction'
    });
  }
};

const getSubscriptionTransactionsByInstituteId = async (req, res) => {
  try {
    const transactions = await service.getSubscriptionTransactionsByInstituteId(
      req.params.institute_id
    );

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: transactions,
      message: 'Subscription transactions retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching subscription transactions'
    });
  }
};

const getActiveSubscriptions = async (req, res) => {
  try {
    const subscriptions = await service.getActiveSubscriptions();

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: subscriptions,
      message: 'Active subscriptions retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching active subscriptions'
    });
  }
};

const getExpiredSubscriptions = async (req, res) => {
  try {
    const subscriptions = await service.getExpiredSubscriptions();

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: subscriptions,
      message: 'Expired subscriptions retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching expired subscriptions'
    });
  }
};

const getExpiringSubscriptions = async (req, res) => {
  try {
    const days = req.query.days ? parseInt(req.query.days) : 7;
    const subscriptions = await service.getExpiringSubscriptions(days);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: subscriptions,
      message: `Subscriptions expiring in ${days} days retrieved successfully`
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching expiring subscriptions'
    });
  }
};

const updateSubscriptionTransaction = async (req, res) => {
  try {
    const { error } = updateSubscriptionTransactionValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const transaction = await service.updateSubscriptionTransaction(
      req.params.id,
      req.body
    );

    if (!transaction) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Subscription transaction not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: transaction,
      message: 'Subscription transaction updated successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while updating subscription transaction'
    });
  }
};

const deactivateSubscription = async (req, res) => {
  try {
    const subscription = await service.deactivateSubscription(req.params.id);

    if (!subscription) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Subscription not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: subscription,
      message: 'Subscription deactivated successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while deactivating subscription'
    });
  }
};

const deleteSubscriptionTransaction = async (req, res) => {
  try {
    const transaction = await service.deleteSubscriptionTransaction(req.params.id);

    if (!transaction) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Subscription transaction not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: transaction,
      message: 'Subscription transaction deleted successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while deleting subscription transaction'
    });
  }
};

module.exports = {
  createSubscriptionTransaction, 
  getAllSubscriptionTransactions,
  getSubscriptionTransactionById,
  getSubscriptionTransactionsByInstituteId,
  getActiveSubscriptions,
  getExpiredSubscriptions,
  getExpiringSubscriptions,
  updateSubscriptionTransaction,
  deactivateSubscription,
  deleteSubscriptionTransaction
};