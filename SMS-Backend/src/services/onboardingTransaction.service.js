const mongoose = require('mongoose');
const OnboardingBasicInformation = require('../models/onboardingBasicInformation.model');
const OnboardingInstituteDetails = require('../models/onboardingInstituteDetails.model');
const OnboardingTransaction = require('../models/onboardingInstituteApplicationTransaction.model');
const SubscriptionPlanVariant = require('../models/subscriptionPlanVariant.model');
const { generateReferenceId } = require('../utils/generateCodes');
  



const convertDecimal128Safe = (value) => {
  // 1️⃣ Decimal128 → number
  if (value instanceof mongoose.Types.Decimal128) {
    return Number(value.toString());
  }

  // 2️⃣ Date → keep as is
  if (value instanceof Date) {
    return value;
  }

  // 3️⃣ ObjectId → keep as is
  if (value instanceof mongoose.Types.ObjectId) {
    return value;
  }

  // 4️⃣ Array → recurse
  if (Array.isArray(value)) {
    return value.map(v => convertDecimal128Safe(v));
  }

  // 5️⃣ Plain object ONLY
  if (
    value &&
    typeof value === 'object' &&
    value.constructor === Object
  ) {
    const obj = {};
    for (const key in value) {
      obj[key] = convertDecimal128Safe(value[key]);
    }
    return obj;
  }

  // 6️⃣ Primitive (string, number, boolean, null)
  return value;
};




const normalizeDecimal = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  Object.keys(obj).forEach(key => {
    if (obj[key]?.$numberDecimal) {
      obj[key] = Number(obj[key].$numberDecimal); // or keep as string if you prefer
    } else if (typeof obj[key] === 'object') {
      normalizeDecimal(obj[key]);
    }
  });

  return obj;
};
 

const createTransaction = async (data) => {
  const { onboarding_basic_info_id, subscription_plan_variant_id } = data;

  // Check if institute details exist for the given onboarding_basic_info_id
  const instituteDetails = await OnboardingInstituteDetails.findOne({
    onboarding_basic_info_id,
  });
  if (!instituteDetails) {
    throw new Error('Institute details are missing for this onboarding record');
  }
  // Check if a transaction already exists for the given onboarding_basic_info_id
  const existingTransaction = await OnboardingTransaction.findOne({
    onboarding_basic_info_id,
  });
  if (existingTransaction) {
    throw new Error('A transaction already exists for this onboarding record');
  }

  const planVariant = await SubscriptionPlanVariant.findById(
    subscription_plan_variant_id
  ).select('price discount_percentage');         

  if (!planVariant) {
    throw new Error('Subscription plan variant not found');
  }

  // Use discounted price if needed
  const finalAmount =
    planVariant.discount_percentage > 0
      ? planVariant.discounted_price
      : Number(planVariant.price.toString());

  const transaction = new OnboardingTransaction({
    reference_id: generateReferenceId(),
    onboarding_basic_info_id,
    subscription_plan_variant_id,
    amount: finalAmount, // ✅ mapped correctly
    currency: 'INR'
  });

  return await transaction.save();
};

//I want one function to get the list of perticular transactions with all the details populated onboarding_basic_info_id, onboardingInstituteDetails, OnboardingBasicInformation, subscription_plan_variant_id with plan_master_id populated.
const getTransactionWithDetails = async (onboarding_basic_info_id) => {
  return await OnboardingTransaction.find({ onboarding_basic_info_id })
    .populate('onboarding_basic_info_id')
    .populate({
      path: 'subscription_plan_variant_id',
      populate: {
        path: 'plan_master_id', 
        model: 'SubscriptionPlanMaster' 
      }
    })
    .sort({ createdAt: -1 });
};

const getAllTransactions = async () => {  
  return await OnboardingTransaction.find()
    .populate('onboarding_basic_info_id')
    .populate({
      path: 'subscription_plan_variant_id',
      populate: {
        path: 'plan_master_id',
        model: 'SubscriptionPlanMaster' 
      }
    })
    .sort({ createdAt: -1 });
};


const getTransactionById = async (id) => {
  return await OnboardingTransaction.findById(id)
    .populate('onboarding_basic_info_id')
    // .populate('subscription_plan_variant_id');
    .populate({
      path: 'subscription_plan_variant_id',
      populate: {
        path: 'plan_master_id',
        model: 'SubscriptionPlanMaster' 
      }
    }) 
};

const getTransactionByReferenceId = async (reference_id) => {
  return await OnboardingTransaction.findOne({ reference_id })
    .populate('onboarding_basic_info_id')
    // .populate('subscription_plan_variant_id');
    .populate({
      path: 'subscription_plan_variant_id',
      populate: {
        path: 'plan_master_id',
        model: 'SubscriptionPlanMaster' 
      }
    })
};

const getTransactionsByOnboardingId = async (onboarding_basic_info_id) => {
  return await OnboardingTransaction.find({ onboarding_basic_info_id })
    // .populate('subscription_plan_variant_id')
    .populate({
      path: 'subscription_plan_variant_id',
      populate: {
        path: 'plan_master_id',
        model: 'SubscriptionPlanMaster' 
      }
    })
    .sort({ createdAt: -1 }); 
};

const getTransactionsByPaymentStatus = async (payment_status) => {
  return await OnboardingTransaction.find({ payment_status })
    .populate('onboarding_basic_info_id')
    // .populate('subscription_plan_variant_id')
    .populate({
      path: 'subscription_plan_variant_id',
      populate: {
        path: 'plan_master_id',
        model: 'SubscriptionPlanMaster' 
      }
    })
    .sort({ createdAt: -1 });
};

const getTransactionsByApplicationStatus = async (application_status) => {
  return await OnboardingTransaction.find({ application_status })
    .populate('onboarding_basic_info_id')
    // .populate('subscription_plan_variant_id')
    .populate({
      path: 'subscription_plan_variant_id',
      populate: {
        path: 'plan_master_id',
        model: 'SubscriptionPlanMaster' 
      }
    })
    .sort({ createdAt: -1 });
};

const updateTransaction = async (id, updateData) => {
  return await OnboardingTransaction.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  })
    .populate('onboarding_basic_info_id')
    // .populate('subscription_plan_variant_id');
    .populate({
      path: 'subscription_plan_variant_id',
      populate: {
        path: 'plan_master_id',
        model: 'SubscriptionPlanMaster' 
      }
    })
};

const updatePaymentStatus = async (id, paymentData) => {
  return await OnboardingTransaction.findByIdAndUpdate(id, paymentData, {
    new: true,
    runValidators: true
  });
};

const updateApplicationStatus = async (id, application_status) => {
  return await OnboardingTransaction.findByIdAndUpdate(
    id,
    { application_status },
    { new: true, runValidators: true }
  );
};

const deleteTransaction = async (id) => {
  return await OnboardingTransaction.findByIdAndDelete(id);
};

// const getTransactionWithFullDetails = async (filter = {}) => {
//   // Step 1: Fetch transactions with main populates
//   const transactions = await OnboardingTransaction.find(filter)
//     .populate({
//       path: 'onboarding_basic_info_id',
//       model: 'OnboardingBasicInformation'
//     })
//     .populate({
//       path: 'subscription_plan_variant_id',
//       populate: {
//         path: 'plan_master_id',
//         model: 'SubscriptionPlanMaster'
//       }
//     })
//     .sort({ createdAt: -1 })
//     .lean(); // 👈 important for merging data

//   if (!transactions.length) return [];

//   // Step 2: Collect onboarding_basic_info_ids
//   const onboardingIds = transactions.map(
//     tx => tx.onboarding_basic_info_id?._id
//   );

//   // Step 3: Fetch institute details for all onboarding IDs
//   const instituteDetailsList = await OnboardingInstituteDetails.find({
//     onboarding_basic_info_id: { $in: onboardingIds }
//   }).lean();

//   // Step 4: Map institute details by onboarding_basic_info_id
//   const instituteDetailsMap = {};
//   instituteDetailsList.forEach(item => {
//     instituteDetailsMap[item.onboarding_basic_info_id.toString()] = item;
//   });

//   // Step 5: Merge institute details into transactions
//   const finalResult = transactions.map(tx => ({
//     ...tx,
//     onboarding_institute_details:
//       instituteDetailsMap[tx.onboarding_basic_info_id?._id?.toString()] || null
//   }));

//   return finalResult;
// };


const getTransactionWithFullDetails = async (filter = {}) => {
  const transactions = await OnboardingTransaction.find(filter)
    .populate('onboarding_basic_info_id')
    .populate({
      path: 'subscription_plan_variant_id',
      populate: { path: 'plan_master_id' }
    })
    .sort({ createdAt: -1 })
    .lean();

  // CASE 1: transactions exist
  if (transactions.length) {
    const onboardingIds = [
      ...new Set(
        transactions
          .map(tx => tx.onboarding_basic_info_id?._id)
          .filter(Boolean)
      )
    ];

    const instituteDetails = await OnboardingInstituteDetails.find({
      onboarding_basic_info_id: { $in: onboardingIds }
    }).lean();

    const instituteMap = {};
    instituteDetails.forEach(i => {
      instituteMap[i.onboarding_basic_info_id.toString()] = i;
    });

    return {
      hasTransaction: true,
      data: convertDecimal128Safe(
        transactions.map(tx => ({
          ...tx,
          onboarding_institute_details:
            instituteMap[tx.onboarding_basic_info_id?._id?.toString()] || null
        }))
      )
    };
  }

  // CASE 2: no transaction → onboarding-only
  if (filter.onboarding_basic_info_id) {
    const onboardingBasicInfo =
      await OnboardingBasicInformation.findById(
        filter.onboarding_basic_info_id
      ).lean();

    const instituteDetails =
      await OnboardingInstituteDetails.findOne({
        onboarding_basic_info_id: filter.onboarding_basic_info_id
      }).lean();

    return {
      hasTransaction: false,
      data: convertDecimal128Safe({
        onboarding_basic_info: onboardingBasicInfo,
        onboarding_institute_details: instituteDetails || null,
        subscription_plan_variant: null
      })
    };
  }

  return { hasTransaction: false, data: [] };
};



const getTransactionWithFullDetailsByOnboardingBasicInfoId = async (
  onboarding_basic_info_id
) => {
  // STEP 1: Try to fetch transactions
  const transactions = await OnboardingTransaction.find({
    onboarding_basic_info_id
  })
    .populate({
      path: 'onboarding_basic_info_id',
      model: 'OnboardingBasicInformation'
    })
    .populate({
      path: 'subscription_plan_variant_id',
      populate: {
        path: 'plan_master_id',
        model: 'SubscriptionPlanMaster'
      }
    })
    .sort({ createdAt: -1 })
    .lean();

  // STEP 2: Fetch institute details
  const instituteDetails = await OnboardingInstituteDetails.findOne({
    onboarding_basic_info_id
  }).lean();

  // ✅ CASE 1: Transactions exist → return transactions
  // if (transactions.length) {
  //   return {
  //     hasTransaction: true,
  //     data: transactions.map(tx => ({
  //       ...tx,
  //       onboarding_institute_details: instituteDetails || null
  //     }))
  //   };
  // }

if (transactions.length) {
  return {
    hasTransaction: true,
    data: convertDecimal128Safe(
      transactions.map(tx => ({
        ...tx,
        onboarding_institute_details: instituteDetails || null
      }))
    )
  };
}




  // ✅ CASE 2: NO transaction → return onboarding-only data
  const onboardingBasicInfo = await OnboardingBasicInformation.findById(
    onboarding_basic_info_id
  ).lean();

  if (!onboardingBasicInfo) {
    throw new Error('Onboarding basic information not found');
  }

  return {
    // hasTransaction: false,
    // data: {
    //   onboarding_basic_info: onboardingBasicInfo,
    //   onboarding_institute_details: instituteDetails || null,
    //   subscription_plan_variant: null

    hasTransaction: false,
    data: convertDecimal128Safe({
    onboarding_basic_info: onboardingBasicInfo,
    onboarding_institute_details: instituteDetails || null,
    subscription_plan_variant: null
    })
  };
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
  getTransactionWithDetails,
  getTransactionWithFullDetails,
  getTransactionWithFullDetailsByOnboardingBasicInfoId 
};




