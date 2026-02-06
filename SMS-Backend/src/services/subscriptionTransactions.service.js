const InstituteSubscriptionTransactions = require('../models/instituteSubscriptionTransactions.model');

const createSubscriptionTransaction = async (transactionData) => {
  const transaction = new InstituteSubscriptionTransactions(transactionData);
  return await transaction.save();
};
 
const getAllSubscriptionTransactions = async () => {
  return await InstituteSubscriptionTransactions.find()
    .populate('institute_id')
    .populate('subscription_plan_variant_id')
    .sort({ createdAt: -1 });
};

const getSubscriptionTransactionById = async (id) => {
  return await InstituteSubscriptionTransactions.findById(id)
    .populate('institute_id')
    .populate('subscription_plan_variant_id');
};

const getSubscriptionTransactionsByInstituteId = async (institute_id) => {
  return await InstituteSubscriptionTransactions.find({ institute_id })
    .populate('subscription_plan_variant_id')
    .sort({ createdAt: -1 });
};

const getActiveSubscriptions = async () => {
  return await InstituteSubscriptionTransactions.find({ is_active: true })
    .populate('institute_id')
    .populate('subscription_plan_variant_id')
    .sort({ createdAt: -1 });
};

const getExpiredSubscriptions = async () => {
  const currentDate = new Date();
  return await InstituteSubscriptionTransactions.find({
    subscription_end_date: { $lt: currentDate },
    is_active: true
  })
    .populate('institute_id')
    .populate('subscription_plan_variant_id')
    .sort({ subscription_end_date: -1 });
};

const getExpiringSubscriptions = async (days = 7) => {
  const currentDate = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  return await InstituteSubscriptionTransactions.find({
    subscription_end_date: { $gte: currentDate, $lte: futureDate },
    is_active: true
  })
    .populate('institute_id')
    .populate('subscription_plan_variant_id')
    .sort({ subscription_end_date: 1 });
};

const updateSubscriptionTransaction = async (id, updateData) => {
  return await InstituteSubscriptionTransactions.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  )
    .populate('institute_id')
    .populate('subscription_plan_variant_id');
};

const deactivateSubscription = async (id) => {
  return await InstituteSubscriptionTransactions.findByIdAndUpdate(
    id,
    { is_active: false },
    { new: true }
  );
};

const deleteSubscriptionTransaction = async (id) => {
  return await InstituteSubscriptionTransactions.findByIdAndDelete(id);
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