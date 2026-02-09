// controllers/subjectsMaster.controller.js
const subjectsMasterService = require('../services/subjectsMaster.service');
const {
  createSubjectValidation,
  updateSubjectValidation
} = require('../validations/subjectsMaster.validation');
const statusCode = require('../enums/statusCode');

const createSubject = async (req, res) => {
  try {
    const { error } = createSubjectValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const subject = await subjectsMasterService.createSubject(req.body);

    return res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: subject,
      message: 'Subject created successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while creating subject'
    });
  }
};

const getAllSubjects = async (req, res) => {
  try {
    const subjects = await subjectsMasterService.getAllSubjects();

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: subjects,
      message: 'Subjects retrieved successfully'
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

const getSubjectById = async (req, res) => {
  try {
    const subject = await subjectsMasterService.getSubjectById(req.params.id);

    if (!subject) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        isException: false,
        statusCode: statusCode.NOT_FOUND,
        result: null,
        message: 'Subject not found'
      });
    }

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: subject,
      message: 'Subject retrieved successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while fetching subject'
    });
  }
};

const getSubjectsByInstituteId = async (req, res) => {
  try {
    const subjects = await subjectsMasterService.getSubjectsByInstituteId(req.params.institute_id);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: subjects,
      message: 'Subjects retrieved successfully'
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

const getSubjectsByType = async (req, res) => {
  try {
    const { type } = req.params;

    if (!['school', 'coaching'].includes(type)) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: 'Invalid subject type. Must be "school" or "coaching"'
      });
    }

    const subjects = await subjectsMasterService.getSubjectsByType(type);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: subjects,
      message: 'Subjects retrieved successfully'
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

const getSubjectsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    if (!['active', 'inactive', 'archived'].includes(status)) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: 'Invalid status. Must be "active", "inactive" or "archived"'
      });
    }

    const subjects = await subjectsMasterService.getSubjectsByStatus(status);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: subjects,
      message: 'Subjects retrieved successfully'
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

const getSubjectsByClassLevel = async (req, res) => {
  try {
    const subjects = await subjectsMasterService.getSubjectsByClassLevel(req.params.class_level);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: subjects,
      message: 'Subjects retrieved successfully'
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

const getSubjectsByInstituteAndType = async (req, res) => {
  try {
    const { institute_id, type } = req.params;

    if (!['school', 'coaching'].includes(type)) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: 'Invalid subject type. Must be "school" or "coaching"'
      });
    }

    const subjects = await subjectsMasterService.getSubjectsByInstituteAndType(institute_id, type);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: subjects,
      message: 'Subjects retrieved successfully'
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

const updateSubject = async (req, res) => {
  try {
    const { error } = updateSubjectValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: null,
        message: error.details[0].message
      });
    }

    const subject = await subjectsMasterService.updateSubject(req.params.id, req.body);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: subject,
      message: 'Subject updated successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while updating subject'
    });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const result = await subjectsMasterService.deleteSubject(req.params.id);

    return res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: result,
      message: 'Subject deleted successfully'
    });
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: null,
      message: err.message || 'Something went wrong while deleting subject'
    });
  }
};

module.exports = {
  createSubject,
  getAllSubjects,
  getSubjectById,
  getSubjectsByInstituteId,
  getSubjectsByType,
  getSubjectsByStatus,
  getSubjectsByClassLevel,
  getSubjectsByInstituteAndType,
  updateSubject,
  deleteSubject
};