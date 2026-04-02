
const service = require('../services/instituteDetails.service');
const { createInstituteDetailsValidation, updateInstituteDetailsValidation } = require('../validations/institutes.validation');
const statusCode = require('../enums/statusCode');

const createInstituteDetails = async (req, res) => {
  try {
    const { error } = createInstituteDetailsValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const details = await service.createInstituteDetails(req.body);

    return res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: details,
      message: 'Institute details created successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while creating institute details'
    });
  }
}; 
 
const getAllInstituteDetails = async (req, res) => { 
  try { 
    const details = await service.getAllInstituteDetails();

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: details,
      message: 'Institute details retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching institute details'
    });
  }
};

const getInstituteDetailsById = async (req, res) => {
  try {
    const details = await service.getInstituteDetailsById(req.params.id);

    if (!details) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Institute details not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: details,
      message: 'Institute details retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching institute details'
    });
  }
};

const getInstituteDetailsByInstituteId = async (req, res) => {
  try {
    const details = await service.getInstituteDetailsByInstituteId(
      req.params.institute_id
    );

    if (!details) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Institute details not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: details,
      message: 'Institute details retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching institute details'
    });
  }
};

const getInstituteDetailsBySchoolBoard = async (req, res) => {
  try {
    const details = await service.getInstituteDetailsBySchoolBoard(
      req.params.school_board
    );

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: details,
      message: 'Institute details retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching institute details'
    });
  }
};

const getInstituteDetailsBySchoolType = async (req, res) => {
  try {
    const details = await service.getInstituteDetailsBySchoolType(
      req.params.school_type
    );

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: details,
      message: 'Institute details retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching institute details'
    });
  }
};

const getInstituteDetailsByMedium = async (req, res) => {
  try {
    const details = await service.getInstituteDetailsByMedium(
      req.params.medium
    );

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: details,
      message: 'Institute details retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching institute details'
    });
  }
};

const getInstituteDetailsByStudentsRange = async (req, res) => {
  try {
    const details = await service.getInstituteDetailsByStudentsRange(
      req.params.approx_students_range
    );

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: details,
      message: 'Institute details retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching institute details'
    });
  }
};

const updateInstituteDetails = async (req, res) => {
  try {
    const { error } = updateInstituteDetailsValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const details = await service.updateInstituteDetails(
      req.params.id,
      req.body
    );

    if (!details) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Institute details not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: details,
      message: 'Institute details updated successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while updating institute details'
    });
  }
};

const deleteInstituteDetails = async (req, res) => {
  try {
    const details = await service.deleteInstituteDetails(req.params.id);

    if (!details) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Institute details not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: details,
      message: 'Institute details deleted successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while deleting institute details'
    });
  }
};

module.exports = {
  createInstituteDetails,
  getAllInstituteDetails,
  getInstituteDetailsById,
  getInstituteDetailsByInstituteId,
  getInstituteDetailsBySchoolBoard,
  getInstituteDetailsBySchoolType,
  getInstituteDetailsByMedium,
  getInstituteDetailsByStudentsRange,
  updateInstituteDetails,
  deleteInstituteDetails
};