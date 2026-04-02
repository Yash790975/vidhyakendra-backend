 
const InstitutesMaster = require('../models/institutesMaster.model');
const InstituteBasicInformation = require('../models/instituteBasicInformation.model');
const InstituteDetails = require('../models/instituteDetails.model');
const InstituteSubscriptionTransactions = require('../models/instituteSubscriptionTransactions.model');
const OnboardingBasicInformation = require('../models/onboardingBasicInformation.model');
const OnboardingInstituteDetails = require('../models/onboardingInstituteDetails.model'); 
const OnboardingTransaction = require('../models/onboardingInstituteApplicationTransaction.model');
const { generateInstituteCode } = require('../utils/generateCodes');
const mongoose = require('mongoose'); 

// const activateInstitute = async (onboarding_basic_info_id, transaction_id) => { 
  const activateInstitute = async (onboarding_basic_info_id, transaction_reference_id) => {

  // const session = await mongoose.startSession(); 
  // session.startTransaction();
 
  try {
    const onboardingBasic = await OnboardingBasicInformation.findById(
      onboarding_basic_info_id
    );
    if (!onboardingBasic) {
      throw new Error('Onboarding basic information not found');
    }

    const onboardingDetails = await OnboardingInstituteDetails.findOne({
      onboarding_basic_info_id
    });

    // const transaction = await OnboardingTransaction.findById(transaction_id).populate(  
    //   'subscription_plan_variant_id'
    // );
    const transaction = await OnboardingTransaction.findOne({
      reference_id: transaction_reference_id
    }).populate('subscription_plan_variant_id');

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    await OnboardingBasicInformation.findByIdAndUpdate(
      onboarding_basic_info_id,
      {
        is_archived: true,
        archived_at: new Date()
      },
      // { session }
    );

    const institute_code = generateInstituteCode();
    const instituteMaster = new InstitutesMaster({
      institute_code,
      institute_name: onboardingBasic.institute_name,
      institute_type: onboardingBasic.institute_type,
      application_reference_id: transaction.reference_id,
      status: 'active'
    });
    // await instituteMaster.save({ session });
    await instituteMaster.save();

    const instituteBasicInfo = new InstituteBasicInformation({
      institute_id: instituteMaster._id,
      owner_name: onboardingBasic.owner_name,
      designation: onboardingBasic.designation,
      email: onboardingBasic.email,
      mobile: onboardingBasic.mobile,
      address: onboardingBasic.address,
      email_verified: false,
      mobile_verified: onboardingBasic.mobile_number_verified || false
    });
    // await instituteBasicInfo.save({ session });
    await instituteBasicInfo.save();

    if (onboardingDetails) {
      const instituteDetails = new InstituteDetails({
        institute_id: instituteMaster._id,
        school_board: onboardingDetails.school_board,
        school_type: onboardingDetails.school_type,
        classes_offered: onboardingDetails.classes_offered,
        courses_offered: onboardingDetails.courses_offered,
        medium: onboardingDetails.medium,
        approx_students_range: onboardingDetails.approx_students_range
      });
      // await instituteDetails.save({ session });
      await instituteDetails.save();
    }

    const planVariant = transaction.subscription_plan_variant_id;
    const durationMonths = planVariant.plan_master_id?.duration_months || 1;

    const subscription_start_date = new Date();
    const subscription_end_date = new Date();
    subscription_end_date.setMonth(
      subscription_end_date.getMonth() + durationMonths
    );

    const subscriptionTransaction = new InstituteSubscriptionTransactions({
      institute_id: instituteMaster._id,
      subscription_plan_variant_id: transaction.subscription_plan_variant_id,
      amount: transaction.amount,
      payment_status: 'success',
      payment_gateway: transaction.payment_gateway,
      transaction_id: transaction.payment_transaction_id,
      receipt_url: transaction.receipt_url,
      paid_at: new Date(),
      subscription_start_date,
      subscription_end_date,
      is_active: true
    });
    // await subscriptionTransaction.save({ session });
    await subscriptionTransaction.save();

    // await OnboardingTransaction.findByIdAndUpdate(
    //   transaction_id,
    //   { application_status: 'account_activated' },
    //   { session }
    // );
    await OnboardingTransaction.findOneAndUpdate(
  { reference_id: transaction_reference_id },
  // { application_status: 'account_activated' },{ session }
  { application_status: 'account_activated' }
);


    // await session.commitTransaction();

    return {
      instituteMaster,
      instituteBasicInfo,
      subscriptionTransaction
    };
  } catch (error) {
    // await session.abortTransaction();
    throw error;
  } finally {
    // session.endSession();
  }
};

const createInstituteMaster = async (instituteData) => {
  const institute_code = generateInstituteCode();
  const institute = new InstitutesMaster({
    ...instituteData,
    institute_code
  });
  return await institute.save();
};

const getAllInstitutes = async () => {
  return await InstitutesMaster.find().sort({ createdAt: -1 });
};

const getInstituteById = async (id) => {
  return await InstitutesMaster.findById(id);
};

const getInstituteByCode = async (institute_code) => {
  return await InstitutesMaster.findOne({ institute_code });
};

const getInstitutesByType = async (institute_type) => {
  return await InstitutesMaster.find({ institute_type }).sort({ createdAt: -1 });
};

const getInstitutesByStatus = async (status) => {
  return await InstitutesMaster.find({ status }).sort({ createdAt: -1 });
};

const updateInstitute = async (id, updateData) => {
  return await InstitutesMaster.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });
};

const deleteInstitute = async (id) => {
  return await InstitutesMaster.findByIdAndDelete(id);     
};

module.exports = {
  activateInstitute,
  createInstituteMaster,
  getAllInstitutes,
  getInstituteById,
  getInstituteByCode,
  getInstitutesByType,
  getInstitutesByStatus,
  updateInstitute,
  deleteInstitute
};


