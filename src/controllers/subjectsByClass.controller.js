const subjectsByClassService = require('../services/subjectsByClass.service');
const {
  createSubjectByClassValidation,
  updateSubjectByClassValidation
} = require('../validations/subjectsByClass.validation');
const statusCode = require('../enums/statusCode');

const createSubjectByClass = async (req, res) => {
  try {
    const { error } = createSubjectByClassValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const record = await subjectsByClassService.createSubjectByClass(req.body);

    return res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: record,
      message: 'Subject assigned to class successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while creating subject by class'
    });
  }
};

const getAllSubjectsByClass = async (req, res) => {
  try {
    const records = await subjectsByClassService.getAllSubjectsByClass();
    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: records,
      message: 'Subjects by class retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching subjects by class'
    });
  }
};

const getSubjectByClassId = async (req, res) => {
  try {
    const record = await subjectsByClassService.getSubjectByClassId(req.params.id);

    if (!record) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Subject by class record not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: record,
      message: 'Subject by class record retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching subject by class'
    });
  }
};

const getSubjectsByClassInstituteId = async (req, res) => {
  try {
    const records = await subjectsByClassService.getSubjectsByClassInstituteId(req.params.institute_id);
    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: records,
      message: 'Subjects by class retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching subjects by class'
    });
  }
};

const getSubjectsByClassId = async (req, res) => {
  try {
    const records = await subjectsByClassService.getSubjectsByClassId(req.params.class_id);
    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: records,
      message: 'Subjects by class retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching subjects by class'
    });
  }
};

const getSubjectsByInstituteAndClass = async (req, res) => {
  try {
    const { institute_id, class_id } = req.params;
    const records = await subjectsByClassService.getSubjectsByInstituteAndClass(institute_id, class_id);
    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: records,
      message: 'Subjects by class retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching subjects by class'
    });
  }
};

const getSubjectsByInstituteClassAndSection = async (req, res) => {
  try {
    const { institute_id, class_id, section_id } = req.params;
    const records = await subjectsByClassService.getSubjectsByInstituteClassAndSection(
      institute_id, class_id, section_id
    );
    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: records,
      message: 'Subjects by class and section retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching subjects'
    });
  }
};

const getSubjectsByClassStatus = async (req, res) => {
  try {
    const { status } = req.params;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: 'Invalid status. Must be "active" or "inactive"'
      });
    }

    const records = await subjectsByClassService.getSubjectsByClassStatus(status);
    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: records,
      message: 'Subjects by class retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching subjects by class'
    });
  }
};

const getSubjectsByClassType = async (req, res) => {
  try {
    const { type } = req.params;

    if (!['theory', 'practical', 'both'].includes(type)) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: 'Invalid subject type. Must be "theory", "practical", or "both"'
      });
    }

    const records = await subjectsByClassService.getSubjectsByClassType(type);
    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: records,
      message: 'Subjects by class retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching subjects by class'
    });
  }
};

const updateSubjectByClass = async (req, res) => {
  try {
    const { error } = updateSubjectByClassValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const record = await subjectsByClassService.updateSubjectByClass(req.params.id, req.body);
    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: record,
      message: 'Subject by class updated successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while updating subject by class'
    });
  }
};

const deleteSubjectByClass = async (req, res) => {
  try {
    const result = await subjectsByClassService.deleteSubjectByClass(req.params.id);
    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result,
      message: 'Subject by class deleted successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while deleting subject by class'
    });
  }
};

module.exports = {
  createSubjectByClass,
  getAllSubjectsByClass,
  getSubjectByClassId,
  getSubjectsByClassInstituteId,
  getSubjectsByClassId,
  getSubjectsByInstituteAndClass,
  getSubjectsByInstituteClassAndSection,
  getSubjectsByClassStatus,
  getSubjectsByClassType,
  updateSubjectByClass,
  deleteSubjectByClass
};
