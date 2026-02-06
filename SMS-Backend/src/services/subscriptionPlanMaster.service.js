const SubscriptionPlanMaster = require('../models/subscriptionPlanMaster.model');

const createPlanMaster = async (data) => {
  try {
    const planMaster = new SubscriptionPlanMaster(data);
    await planMaster.save();
    return planMaster;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Plan with this name already exists');
    }
    throw error;
  }
};

const getAllPlanMasters = async (filters = {}) => {
  try {
    const query = {};
    
    if (filters.is_active !== undefined) {
      query.is_active = filters.is_active;
    }
    
    const planMasters = await SubscriptionPlanMaster.find(query).sort({ duration_months: 1 });
    return planMasters;
  } catch (error) {
    throw error;
  }
};

const getPlanMasterById = async (id) => {
  try {
    const planMaster = await SubscriptionPlanMaster.findById(id);
    
    if (!planMaster) {
      throw new Error('Plan master not found');
    }
    
    return planMaster;
  } catch (error) {
    throw error;
  }
};

const updatePlanMaster = async (id, data) => {
  try {
    const planMaster = await SubscriptionPlanMaster.findByIdAndUpdate(
      id,
      data,
      { 
        new: true, 
        runValidators: true 
      }
    );
    
    if (!planMaster) {
      throw new Error('Plan master not found');
    }
    
    return planMaster;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Plan with this name already exists');
    }
    throw error;
  }
};

const deletePlanMaster = async (id) => {
  try {
    const planMaster = await SubscriptionPlanMaster.findByIdAndDelete(id);
    
    if (!planMaster) {
      throw new Error('Plan master not found');
    }
    
    return planMaster;
  } catch (error) {
    throw error;
  }
};

const getActivePlanMasters = async () => {
  try {
    const planMasters = await SubscriptionPlanMaster.find({ is_active: true }).sort({ duration_months: 1 });
    return planMasters;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createPlanMaster,
  getAllPlanMasters,
  getPlanMasterById,
  updatePlanMaster, 
  deletePlanMaster,
  getActivePlanMasters,
};