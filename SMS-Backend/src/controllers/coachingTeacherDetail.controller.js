const coachingTeacherDetailService = require('../services/coachingTeacherDetail.service');
const {
  createDetailValidation,
  updateDetailValidation,
  getByRoleValidation,
  addBatchValidation,
  removeBatchValidation
} = require('../validations/coachingTeacherDetail.validation');
const statusCode = require('../enums/statusCode');

const createDetail = async (req, res) => {
  try {
    const { error } = createDetailValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const detail = await coachingTeacherDetailService.createDetail(req.body);

    return res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: detail,
      message: 'Coaching teacher detail created successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while creating detail'
    });
  }
};

const getAllDetails = async (req, res) => {
  try {
    const details = await coachingTeacherDetailService.getAllDetails();

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: details,
      message: 'Coaching teacher details retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching details'
    });
  }
};

const getDetailById = async (req, res) => {
  try {
    const detail = await coachingTeacherDetailService.getDetailById(req.params.id);

    if (!detail) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Detail not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: detail,
      message: 'Detail retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching detail'
    });
  }
};

const getDetailByTeacherId = async (req, res) => {
  try {
    const detail = await coachingTeacherDetailService.getDetailByTeacherId(req.params.teacherId);

    if (!detail) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Detail not found for this teacher'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: detail,
      message: 'Teacher detail retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching teacher detail'
    });
  }
};

const getDetailsByRole = async (req, res) => {
  try {
    const { error } = getByRoleValidation.validate({ role: req.params.role });
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const details = await coachingTeacherDetailService.getDetailsByRole(req.params.role);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: details,
      message: `${req.params.role} details retrieved successfully`
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching details by role'
    });
  }
};

const getDetailsBySubject = async (req, res) => {
  try {
    const { subject } = req.params;

    if (!subject) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: 'Subject is required'
      });
    }

    const details = await coachingTeacherDetailService.getDetailsBySubject(subject);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: details,
      message: `Teachers for subject ${subject} retrieved successfully`
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching details'
    });
  }
};

const getDetailsByBatchId = async (req, res) => {
  try {
    const { batchId } = req.params;

    if (!batchId) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: 'Batch ID is required'
      });
    }

    const details = await coachingTeacherDetailService.getDetailsByBatchId(batchId);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: details,
      message: 'Teachers for batch retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching details'
    });
  }
};

const getDetailsByPayoutModel = async (req, res) => {
  try {
    const { payoutModel } = req.params;

    if (!['fixed', 'percentage'].includes(payoutModel)) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: 'Invalid payout model. Must be "fixed" or "percentage"'
      });
    }

    const details = await coachingTeacherDetailService.getDetailsByPayoutModel(payoutModel);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: details,
      message: `Teachers with ${payoutModel} payout model retrieved successfully`
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching details'
    });
  }
};

const updateDetail = async (req, res) => {
  try {
    const { error } = updateDetailValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const detail = await coachingTeacherDetailService.updateDetail(req.params.id, req.body);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: detail,
      message: 'Detail updated successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while updating detail'
    });
  }
};

const addBatch = async (req, res) => {
  try {
    const { error } = addBatchValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const detail = await coachingTeacherDetailService.addBatch(req.params.id, req.body.batch_id);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: detail,
      message: 'Batch added successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while adding batch'
    });
  }
};

const removeBatch = async (req, res) => {
  try {
    const { error } = removeBatchValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const detail = await coachingTeacherDetailService.removeBatch(req.params.id, req.body.batch_id);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: detail,
      message: 'Batch removed successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while removing batch'
    });
  }
};

const deleteDetail = async (req, res) => {
  try {
    const result = await coachingTeacherDetailService.deleteDetail(req.params.id);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: result,
      message: 'Detail deleted successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while deleting detail'
    });
  }
};

const deleteDetailByTeacherId = async (req, res) => {
  try {
    const result = await coachingTeacherDetailService.deleteDetailByTeacherId(req.params.teacherId);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: result,
      message: 'Teacher detail deleted successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while deleting teacher detail'
    });
  }
};

module.exports = {
  createDetail,
  getAllDetails,
  getDetailById,
  getDetailByTeacherId,
  getDetailsByRole,
  getDetailsBySubject,
  getDetailsByBatchId,
  getDetailsByPayoutModel,
  updateDetail,
  addBatch,
  removeBatch,
  deleteDetail,
  deleteDetailByTeacherId
};