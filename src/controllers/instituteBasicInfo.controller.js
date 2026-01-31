const service = require('../services/instituteBasicInfo.service');
const { createInstituteBasicInfoValidation, updateInstituteBasicInfoValidation } = require('../validations/institutes.validation');
const statusCode = require('../enums/statusCode');

const createInstituteBasicInfo = async (req, res) => {
  try {
    const { error } = createInstituteBasicInfoValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const basicInfo = await service.createInstituteBasicInfo(req.body);

    return res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: basicInfo,
      message: 'Institute basic information created successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while creating institute basic information'
    });
  }
};

const getAllInstituteBasicInfo = async (req, res) => {
  try {
    const basicInfo = await service.getAllInstituteBasicInfo();

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: basicInfo,
      message: 'Institute basic information retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching institute basic information'
    });
  }
};

const getInstituteBasicInfoById = async (req, res) => {
  try {
    const basicInfo = await service.getInstituteBasicInfoById(req.params.id);

    if (!basicInfo) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Institute basic information not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: basicInfo,
      message: 'Institute basic information retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching institute basic information'
    });
  }
};

const getInstituteBasicInfoByInstituteId = async (req, res) => {
  try {
    const basicInfo = await service.getInstituteBasicInfoByInstituteId(
      req.params.institute_id
    );

    if (!basicInfo) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Institute basic information not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: basicInfo,
      message: 'Institute basic information retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching institute basic information'
    });
  }
};

const getVerifiedInstituteBasicInfo = async (req, res) => {
  try {
    const basicInfo = await service.getVerifiedInstituteBasicInfo();

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: basicInfo,
      message: 'Verified institute basic information retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching verified institute basic information'
    });
  }
};

const updateInstituteBasicInfo = async (req, res) => {
  try {
    const { error } = updateInstituteBasicInfoValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const basicInfo = await service.updateInstituteBasicInfo(
      req.params.id,
      req.body
    );

    if (!basicInfo) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Institute basic information not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: basicInfo,
      message: 'Institute basic information updated successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while updating institute basic information'
    });
  }
};

const deleteInstituteBasicInfo = async (req, res) => {
  try {
    const basicInfo = await service.deleteInstituteBasicInfo(req.params.id);

    if (!basicInfo) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Institute basic information not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: basicInfo,
      message: 'Institute basic information deleted successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while deleting institute basic information'
    });
  }
};

module.exports = {
  createInstituteBasicInfo,
  getAllInstituteBasicInfo,
  getInstituteBasicInfoById,
  getInstituteBasicInfoByInstituteId,
  getVerifiedInstituteBasicInfo,
  updateInstituteBasicInfo,
  deleteInstituteBasicInfo
};