const institutesService = require('../services/institutes.service');
const {
  createInstituteMasterValidation,
  updateInstituteMasterValidation 
} = require('../validations/institutes.validation');
const statusCode = require('../enums/statusCode');

const activateInstitute = async (req, res) => { 
  try {
    const { onboarding_basic_info_id, transaction_id } = req.body;

    if (!onboarding_basic_info_id || !transaction_id) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: 'onboarding_basic_info_id and transaction_id are required'
      });
    }

    const result = await institutesService.activateInstitute(
      onboarding_basic_info_id,
      transaction_id
    );

    return res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result,
      message: 'Institute activated successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while activating institute'
    });
  }
};

const createInstitute = async (req, res) => {
  try {
    const { error } = createInstituteMasterValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const institute = await institutesService.createInstituteMaster(req.body);

    return res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: institute,
      message: 'Institute created successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while creating institute'
    });
  }
};

const getAllInstitutes = async (req, res) => {
  try {
    const institutes = await institutesService.getAllInstitutes();

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: institutes,
      message: 'Institutes retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching institutes'
    });
  }
};

const getInstituteById = async (req, res) => {
  try {
    const institute = await institutesService.getInstituteById(req.params.id);

    if (!institute) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Institute not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: institute,
      message: 'Institute retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching institute'
    });
  }
};

const getInstituteByCode = async (req, res) => {
  try {
    const institute = await institutesService.getInstituteByCode(
      req.params.institute_code
    );

    if (!institute) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Institute not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: institute,
      message: 'Institute retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching institute'
    });
  }
};

const getInstitutesByType = async (req, res) => {
  try {
    const institutes = await institutesService.getInstitutesByType(
      req.params.institute_type
    );

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: institutes,
      message: 'Institutes retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching institutes'
    });
  }
};

const getInstitutesByStatus = async (req, res) => {
  try {
    const institutes = await institutesService.getInstitutesByStatus(
      req.params.status
    );

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: institutes,
      message: 'Institutes retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching institutes'
    });
  }
};

const updateInstitute = async (req, res) => {
  try {
    const { error } = updateInstituteMasterValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const institute = await institutesService.updateInstitute(
      req.params.id,
      req.body
    );

    if (!institute) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Institute not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: institute,
      message: 'Institute updated successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while updating institute'
    });
  }
};

const deleteInstitute = async (req, res) => {
  try {
    const institute = await institutesService.deleteInstitute(req.params.id);

    if (!institute) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Institute not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: institute,
      message: 'Institute deleted successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while deleting institute'
    });
  }
};
 
module.exports = {
  activateInstitute,
  createInstitute,  
  getAllInstitutes,
  getInstituteById,
  getInstituteByCode,
  getInstitutesByType,
  getInstitutesByStatus,
  updateInstitute,
  deleteInstitute
};