const planVariantService = require('../services/subscriptionPlanVariant.service');
const {
  createPlanVariantValidation,
  updatePlanVariantValidation,
  idValidation,
  getByInstituteTypeValidation,
} = require('../validations/subscriptionPlanVariant.validation');

const createPlanVariant = async (req, res, next) => {
  try {
    const { error, value } = createPlanVariantValidation.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        isException: false,
        statusCode: 400,
        result: null,
        message: error.details.map(detail => detail.message).join(', ')
      });
    }

    const planVariant = await planVariantService.createPlanVariant(value);

    res.status(201).json({
      success: true,
      isException: false,
      statusCode: 201,
      result: planVariant,
      message: 'Plan variant created successfully'
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

const getAllPlanVariants = async (req, res, next) => {
  try {
    const { is_active, applicable_for } = req.query;
    
    const filters = {};
    if (is_active !== undefined) {
      filters.is_active = is_active === 'true';
    }
    if (applicable_for) {
      filters.applicable_for = applicable_for;
    }

    const planVariants = await planVariantService.getAllPlanVariants(filters);

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: planVariants,
      message: 'Plan variants retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getPlanVariantById = async (req, res, next) => {
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

    const planVariant = await planVariantService.getPlanVariantById(req.params.id);

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: planVariant,
      message: 'Plan variant retrieved successfully'
    });
  } catch (error) {
    if (error.message === 'Plan variant not found') {
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

const updatePlanVariant = async (req, res, next) => {
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

    const { error, value } = updatePlanVariantValidation.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        isException: false,
        statusCode: 400,
        result: null,
        message: error.details.map(detail => detail.message).join(', ')
      });
    }

    const planVariant = await planVariantService.updatePlanVariant(req.params.id, value);

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: planVariant,
      message: 'Plan variant updated successfully'
    });
  } catch (error) {
    if (error.message === 'Plan variant not found' || error.message === 'Plan master not found') {
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

const deletePlanVariant = async (req, res, next) => {
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

    await planVariantService.deletePlanVariant(req.params.id);

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: null,
      message: 'Plan variant deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Plan variant not found') {
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

const getPlanVariantsByInstituteType = async (req, res, next) => {
  try {
    const { error } = getByInstituteTypeValidation.validate({ institute_type: req.params.institute_type });
    
    if (error) {
      return res.status(400).json({
        success: false,
        isException: false,
        statusCode: 400,
        result: null,
        message: error.details.map(detail => detail.message).join(', ')
      });
    }

    const planVariants = await planVariantService.getPlanVariantsByInstituteType(req.params.institute_type);

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: planVariants,
      message: `Plan variants for ${req.params.institute_type} retrieved successfully`
    });
  } catch (error) {
    next(error);
  }
};

const getPlanVariantsByPlanMasterId = async (req, res, next) => {
  try {
    const { error } = idValidation.validate({ id: req.params.plan_master_id });
    
    if (error) {
      return res.status(400).json({
        success: false,
        isException: false,
        statusCode: 400,
        result: null,
        message: error.details.map(detail => detail.message).join(', ')
      });
    }

    const planVariants = await planVariantService.getPlanVariantsByPlanMasterId(req.params.plan_master_id);

    res.status(200).json({
      success: true,
      isException: false,
      statusCode: 200,
      result: planVariants,
      message: 'Plan variants retrieved successfully'
    });
  } catch (error) {
    next(error);
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























































// const planVariantService = require('../services/subscriptionPlanVariant.service');
// const {
//   createPlanVariantValidation,
//   updatePlanVariantValidation,
//   idValidation,
//   getByInstituteTypeValidation,
// } = require('../validations/subscriptionPlanVariant.validation');

// const createPlanVariant = async (req, res, next) => {
//   try {
//     const { error, value } = createPlanVariantValidation.validate(req.body);
    
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors: error.details.map(detail => detail.message),
//       });
//     }

//     const planVariant = await planVariantService.createPlanVariant(value);

//     res.status(201).json({
//       success: true,
//       message: 'Plan variant created successfully',
//       data: planVariant,
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

// const getAllPlanVariants = async (req, res, next) => {
//   try {
//     const { is_active, applicable_for } = req.query;
    
//     const filters = {};
//     if (is_active !== undefined) {
//       filters.is_active = is_active === 'true';
//     }
//     if (applicable_for) {
//       filters.applicable_for = applicable_for;
//     }

//     const planVariants = await planVariantService.getAllPlanVariants(filters);

//     res.status(200).json({
//       success: true,
//       message: 'Plan variants retrieved successfully',    
//       data: planVariants,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const getPlanVariantById = async (req, res, next) => {
//   try {
//     const { error } = idValidation.validate({ id: req.params.id });
    
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors: error.details.map(detail => detail.message),
//       });
//     }

//     const planVariant = await planVariantService.getPlanVariantById(req.params.id);

//     res.status(200).json({
//       success: true,
//       message: 'Plan variant retrieved successfully',
//       data: planVariant,
//     });
//   } catch (error) {
//     if (error.message === 'Plan variant not found') {
//       return res.status(404).json({
//         success: false,
//         message: error.message,
//       });
//     }
//     next(error);
//   }
// };

// const updatePlanVariant = async (req, res, next) => {
//   try {
//     const { error: idError } = idValidation.validate({ id: req.params.id });
    
//     if (idError) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors: idError.details.map(detail => detail.message),
//       });
//     }

//     const { error, value } = updatePlanVariantValidation.validate(req.body);
    
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors: error.details.map(detail => detail.message),
//       });
//     }

//     const planVariant = await planVariantService.updatePlanVariant(req.params.id, value);

//     res.status(200).json({
//       success: true,
//       message: 'Plan variant updated successfully',
//       data: planVariant,
//     });
//   } catch (error) {
//     if (error.message === 'Plan variant not found' || error.message === 'Plan master not found') {
//       return res.status(404).json({
//         success: false,
//         message: error.message,
//       });
//     }
//     next(error);
//   }
// };

// const deletePlanVariant = async (req, res, next) => {
//   try {
//     const { error } = idValidation.validate({ id: req.params.id });
    
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors: error.details.map(detail => detail.message),
//       });
//     }

//     await planVariantService.deletePlanVariant(req.params.id);

//     res.status(200).json({
//       success: true,
//       message: 'Plan variant deleted successfully',
//     });
//   } catch (error) {
//     if (error.message === 'Plan variant not found') {
//       return res.status(404).json({
//         success: false,
//         message: error.message,
//       });
//     }
//     next(error);
//   }
// };

// const getPlanVariantsByInstituteType = async (req, res, next) => {
//   try {
//     const { error } = getByInstituteTypeValidation.validate({ institute_type: req.params.institute_type });
    
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors: error.details.map(detail => detail.message),
//       });
//     }

//     const planVariants = await planVariantService.getPlanVariantsByInstituteType(req.params.institute_type);

//     res.status(200).json({
//       success: true,
//       message: `Plan variants for ${req.params.institute_type} retrieved successfully`,
//       data: planVariants,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const getPlanVariantsByPlanMasterId = async (req, res, next) => {
//   try {
//     const { error } = idValidation.validate({ id: req.params.plan_master_id });
    
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors: error.details.map(detail => detail.message),
//       });
//     }

//     const planVariants = await planVariantService.getPlanVariantsByPlanMasterId(req.params.plan_master_id);

//     res.status(200).json({
//       success: true,
//       message: 'Plan variants retrieved successfully',
//       data: planVariants,
//     });
//   } catch (error) {
//     next(error);
//   }
// };





// module.exports = {
//   createPlanVariant,
//   getAllPlanVariants,
//   getPlanVariantById,
//   updatePlanVariant,
//   deletePlanVariant,
//   getPlanVariantsByInstituteType,
//   getPlanVariantsByPlanMasterId,
// };