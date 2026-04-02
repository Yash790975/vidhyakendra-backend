const planMasterService = require('../services/subscriptionPlanMaster.service');
const {
  createPlanMasterValidation,
  updatePlanMasterValidation,
  idValidation,
} = require('../validations/subscriptionPlanMaster.validation');

const createPlanMaster = async (req, res, next) => {
  try {
    const { error, value } = createPlanMasterValidation.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        isException: false,
        statusCode: 400,
        result: null,
        message: error.details.map(detail => detail.message).join(', ')
      });
    }

    const planMaster = await planMasterService.createPlanMaster(value);

    res.status(201).json({
      success: true,
      isException: false,
      statusCode: 201,
      result: planMaster,
      message: 'Plan master created successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getAllPlanMasters = async (req, res, next) => {
  try {
    const { is_active } = req.query;
    
    const filters = {};
    if (is_active !== undefined) {
      filters.is_active = is_active === 'true';
    }

    const planMasters = await planMasterService.getAllPlanMasters(filters);

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: planMasters,
      message: 'Plan masters retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getPlanMasterById = async (req, res, next) => {
  try {
    const { error } = idValidation.validate({ id: req.params.id });
    
    if (error) {
      return res.status(400).json({
        success: false,
        isException: false,
        statusCode: 400,
        result: null,
        message: error.details.map(detail => detail.message).join(', ')
      });
    }

    const planMaster = await planMasterService.getPlanMasterById(req.params.id);

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: planMaster,
      message: 'Plan master retrieved successfully'
    });
  } catch (error) {
    if (error.message === 'Plan master not found') {
      return res.status(404).json({
        success: false,
        isException: false,
        statusCode: 404,
        result: null,
        message: error.message
      });
    }
    next(error);
  }
};

const updatePlanMaster = async (req, res, next) => {
  try {
    const { error: idError } = idValidation.validate({ id: req.params.id });
    
    if (idError) {
      return res.status(400).json({
        success: false,
        isException: false,
        statusCode: 400,
        result: null,
        message: idError.details.map(detail => detail.message).join(', ')
      });
    }

    const { error, value } = updatePlanMasterValidation.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        isException: false,
        statusCode: 400,
        result: null,
        message: error.details.map(detail => detail.message).join(', ')
      });
    }

    const planMaster = await planMasterService.updatePlanMaster(req.params.id, value);

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: planMaster,
      message: 'Plan master updated successfully'
    });
  } catch (error) {
    if (error.message === 'Plan master not found') {
      return res.status(404).json({
        success: false,
        isException: false,
        statusCode: 404,
        result: null,
        message: error.message
      });
    }
    next(error);
  }
};

const deletePlanMaster = async (req, res, next) => {
  try {
    const { error } = idValidation.validate({ id: req.params.id });
    
    if (error) {
      return res.status(400).json({
        success: false,
        isException: false,
        statusCode: 400,
        result: null,
        message: error.details.map(detail => detail.message).join(', ')
      });
    }

    await planMasterService.deletePlanMaster(req.params.id);

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: null,
      message: 'Plan master deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Plan master not found') {
      return res.status(404).json({
        success: false,
        isException: false,
        statusCode: 404,
        result: null,
        message: error.message
      });
    }
    next(error);
  }
};

const getActivePlanMasters = async (req, res, next) => {
  try {
    const planMasters = await planMasterService.getActivePlanMasters();

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: planMasters,
      message: 'Active plan masters retrieved successfully'
    });
  } catch (error) {
    next(error);
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



















































// const planMasterService = require('../services/subscriptionPlanMaster.service');
// const {
//   createPlanMasterValidation,
//   updatePlanMasterValidation,
//   idValidation,
// } = require('../validations/subscriptionPlanMaster.validation');

// const createPlanMaster = async (req, res, next) => {
//   try {
//     const { error, value } = createPlanMasterValidation.validate(req.body);
    
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors: error.details.map(detail => detail.message),
//       });
//     }

//     const planMaster = await planMasterService.createPlanMaster(value);

//     res.status(201).json({
//       success: true,
//       message: 'Plan master created successfully',
//       data: planMaster,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const getAllPlanMasters = async (req, res, next) => {
//   try {
//     const { is_active } = req.query;
    
//     const filters = {};
//     if (is_active !== undefined) {
//       filters.is_active = is_active === 'true';
//     }

//     const planMasters = await planMasterService.getAllPlanMasters(filters);

//     res.status(200).json({
//       success: true,
//       message: 'Plan masters retrieved successfully',
//       data: planMasters,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const getPlanMasterById = async (req, res, next) => {
//   try {
//     const { error } = idValidation.validate({ id: req.params.id });
    
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors: error.details.map(detail => detail.message),
//       });
//     }

//     const planMaster = await planMasterService.getPlanMasterById(req.params.id);

//     res.status(200).json({
//       success: true,
//       message: 'Plan master retrieved successfully',
//       data: planMaster,
//     });
//   } catch (error) {
//     if (error.message === 'Plan master not found') {
//       return res.status(404).json({
//         success: false,
//         message: error.message,
//       });
//     }
//     next(error);
//   }
// };

// const updatePlanMaster = async (req, res, next) => {
//   try {
//     const { error: idError } = idValidation.validate({ id: req.params.id });
    
//     if (idError) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors: idError.details.map(detail => detail.message),
//       });
//     }

//     const { error, value } = updatePlanMasterValidation.validate(req.body);
    
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors: error.details.map(detail => detail.message),
//       });
//     }

//     const planMaster = await planMasterService.updatePlanMaster(req.params.id, value);

//     res.status(200).json({
//       success: true,
//       message: 'Plan master updated successfully',
//       data: planMaster,
//     });
//   } catch (error) {
//     if (error.message === 'Plan master not found') {
//       return res.status(404).json({
//         success: false,
//         message: error.message,
//       });
//     }
//     next(error);
//   }
// };

// const deletePlanMaster = async (req, res, next) => {
//   try {
//     const { error } = idValidation.validate({ id: req.params.id });
    
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors: error.details.map(detail => detail.message),
//       });
//     }

//     await planMasterService.deletePlanMaster(req.params.id);

//     res.status(200).json({
//       success: true,
//       message: 'Plan master deleted successfully',
//     });
//   } catch (error) {
//     if (error.message === 'Plan master not found') {
//       return res.status(404).json({
//         success: false,
//         message: error.message,
//       });
//     }
//     next(error);
//   }
// };

// const getActivePlanMasters = async (req, res, next) => {
//   try {
//     const planMasters = await planMasterService.getActivePlanMasters();

//     res.status(200).json({
//       success: true,
//       message: 'Active plan masters retrieved successfully',
//       data: planMasters,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = {
//   createPlanMaster,
//   getAllPlanMasters,
//   getPlanMasterById,
//   updatePlanMaster,
//   deletePlanMaster,
//   getActivePlanMasters,
// };