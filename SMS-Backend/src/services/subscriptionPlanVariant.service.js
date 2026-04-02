const SubscriptionPlanVariant = require('../models/subscriptionPlanVariant.model');
const SubscriptionPlanMaster = require('../models/subscriptionPlanMaster.model');


//On frontend the plan variants are created along with plan master.
//So the flow was like create plan master -> ex: monthly, quarterly, yearly
//Then we create plan variant -> first we select institute type (school/college/both) and then we set price for that plan master for that institute type, then suppose "i select 'school' and set price 100 for monthly, then the price for existing plan master like quarterly price will be 300 for school automatically, similarly for yearly 1200 for school automatically"
//I only have to add discounts for plan masters.
//So the final flow is like 
// 1. create plan master then create plan variant for that plan master for institute type with price, then the other plan variants for that plan master for other durations will be created automatically with multiples of that price.
// 2. Then we add discounts for plan masters only, so when fetching the plan variants we can calculate the discounted price based on the plan master's discount percentage.
// 3. Then when finally we save the variant we have 3 entries at a time in plan variant collection for that plan master for different durations with same institute type but different prices with different discount values.


const createPlanVariant = async (data) => {
  try {
    // Check if plan master exists
    const planMaster = await SubscriptionPlanMaster.findById(data.plan_master_id);
    if (!planMaster) {
      throw new Error('Plan master not found');
    }

    const planVariant = new SubscriptionPlanVariant(data);
    await planVariant.save();
    return planVariant;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Plan variant already exists for this combination of plan and institute type');
    }
    throw error;
  }
};

const getAllPlanVariants = async (filters = {}) => {
  try {
    const query = {};
    
    if (filters.is_active !== undefined) {
      query.is_active = filters.is_active;
    }
    
    if (filters.applicable_for) {
      query.applicable_for = filters.applicable_for;
    }
    
    const planVariants = await SubscriptionPlanVariant.find(query)
      .populate('plan_master_id')
      .sort({ 'plan_master_id.duration_months': 1 }); 
    
    return planVariants; 
  } catch (error) {
    throw error;
  }
};

const getPlanVariantById = async (id) => {
  try {
    const planVariant = await SubscriptionPlanVariant.findById(id).populate('plan_master_id');
    
    if (!planVariant) {
      throw new Error('Plan variant not found');
    }
    
    return planVariant;
  } catch (error) {
    throw error;
  }
};

const updatePlanVariant = async (id, data) => {
  try {
    // If plan_master_id is being updated, check if it exists
    if (data.plan_master_id) {
      const planMaster = await SubscriptionPlanMaster.findById(data.plan_master_id);
      if (!planMaster) {
        throw new Error('Plan master not found');
      }
    }

    const planVariant = await SubscriptionPlanVariant.findByIdAndUpdate(
      id,
      data,
      { 
        new: true, 
        runValidators: true 
      }
    ).populate('plan_master_id');
    
    if (!planVariant) {
      throw new Error('Plan variant not found');
    }
    
    return planVariant;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Plan variant already exists for this combination of plan and institute type');
    }
    throw error;
  }
};

const deletePlanVariant = async (id) => {
  try {
    const planVariant = await SubscriptionPlanVariant.findByIdAndDelete(id);
    
    if (!planVariant) {
      throw new Error('Plan variant not found');
    }
    
    return planVariant;
  } catch (error) {
    throw error;
  }
};

const getPlanVariantsByInstituteType = async (instituteType) => {
  try {
    const query = {
      is_active: true,
      $or: [
        { applicable_for: instituteType },
        { applicable_for: 'both' }
      ]
    };
    
    const planVariants = await SubscriptionPlanVariant.find(query)
      .populate('plan_master_id')
      .sort({ 'plan_master_id.duration_months': 1 });
    
    return planVariants;
  } catch (error) {
    throw error;
  }
};

const getPlanVariantsByPlanMasterId = async (planMasterId) => {
  try {
    const planVariants = await SubscriptionPlanVariant.find({ 
      plan_master_id: planMasterId,
      is_active: true 
    }).populate('plan_master_id');
    
    return planVariants;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createPlanVariant,
  getAllPlanVariants,
  getPlanVariantById,
  updatePlanVariant,
  deletePlanVariant,
  getPlanVariantsByInstituteType,
  getPlanVariantsByPlanMasterId,
};