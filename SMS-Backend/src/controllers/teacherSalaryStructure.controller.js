// controllers/teacherSalaryStructure.controller.js
const teacherSalaryStructureService = require('../services/teacherSalaryStructure.service');
const {
  createSalaryStructureValidation, 
  updateSalaryStructureValidation,
  approveSalaryStructureValidation,
  archiveSalaryStructureValidation
} = require('../validations/teacherSalaryStructure.validation');
const statusCode = require('../enums/statusCode');
const apiResponse = require('../utils/apiResponse');

const createSalaryStructure = async (req, res) => {
  try {
    const { error } = createSalaryStructureValidation.validate(req.body);
    if (error) {     
      return res.status(statusCode.BAD_REQUEST).json(
        apiResponse({
          success: false,
          isException: false,
          statusCode: statusCode.BAD_REQUEST,
          result: null,
          message: error.details[0].message
        })
      );
    }

    // Get admin ID from request body if provided
    const adminId = req.body.approved_by || null;

    const salaryStructure = await teacherSalaryStructureService.createSalaryStructure(
      req.body,
      adminId
    );

    return res.status(statusCode.CREATED).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.CREATED,
        result: salaryStructure,
        message: 'Salary structure created successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while creating salary structure'
      })
    );
  }
};

const getAllSalaryStructures = async (req, res) => {
  try {
    const salaryStructures = await teacherSalaryStructureService.getAllSalaryStructures();

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: salaryStructures,
        message: 'Salary structures retrieved successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while fetching salary structures'
      })
    );
  }
};

const getSalaryStructureById = async (req, res) => {
  try {
    const salaryStructure = await teacherSalaryStructureService.getSalaryStructureById(req.params.id);

    if (!salaryStructure) {
      return res.status(statusCode.NOT_FOUND).json(
        apiResponse({
          success: false,
          isException: false,
          statusCode: statusCode.NOT_FOUND,
          result: null,
          message: 'Salary structure not found'
        })
      );
    }

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: salaryStructure,
        message: 'Salary structure retrieved successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while fetching salary structure'
      })
    );
  }
};

const getSalaryStructuresByTeacherId = async (req, res) => {
  try {
    const salaryStructures = await teacherSalaryStructureService.getSalaryStructuresByTeacherId(req.params.teacher_id);

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: salaryStructures,
        message: 'Salary structures retrieved successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while fetching salary structures'
      })
    );
  }
};

const getActiveSalaryStructureByTeacherId = async (req, res) => {
  try {
    const salaryStructure = await teacherSalaryStructureService.getActiveSalaryStructureByTeacherId(req.params.teacher_id);

    if (!salaryStructure) {
      return res.status(statusCode.NOT_FOUND).json(
        apiResponse({
          success: false,
          isException: false,
          statusCode: statusCode.NOT_FOUND,
          result: null,
          message: 'Active salary structure not found for this teacher'
        })
      );
    }

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: salaryStructure,
        message: 'Active salary structure retrieved successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while fetching active salary structure'
      })
    );
  }
};

const updateSalaryStructure = async (req, res) => {
  try {
    const { error } = updateSalaryStructureValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json(
        apiResponse({
          success: false,
          isException: false,
          statusCode: statusCode.BAD_REQUEST,
          result: null,
          message: error.details[0].message
        })
      );
    }

    // Get admin ID from request body if provided
    const adminId = req.body.approved_by || null;

    const salaryStructure = await teacherSalaryStructureService.updateSalaryStructure(
      req.params.id,
      req.body,
      adminId
    );

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: salaryStructure,
        message: 'Salary structure updated successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while updating salary structure'
      })
    );
  }   
};

const approveSalaryStructure = async (req, res) => {
  try {
    const { error } = approveSalaryStructureValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json(
        apiResponse({
          success: false,
          isException: false,
          statusCode: statusCode.BAD_REQUEST,
          result: null,
          message: error.details[0].message
        })
      );
    }

    const adminId = req.body.approved_by;

    const salaryStructure = await teacherSalaryStructureService.approveSalaryStructure(
      req.params.id,
      adminId
    );

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: salaryStructure,
        message: 'Salary structure approved successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while approving salary structure'
      })
    );
  }
};

const deleteSalaryStructure = async (req, res) => {
  try {
    const result = await teacherSalaryStructureService.deleteSalaryStructure(req.params.id);

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: result,
        message: 'Salary structure deleted successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while deleting salary structure'
      })
    );
  }
};

const archiveSalaryStructure = async (req, res) => {
  try {
    const { error } = archiveSalaryStructureValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json(
        apiResponse({
          success: false,
          isException: false,
          statusCode: statusCode.BAD_REQUEST,
          result: null,
          message: error.details[0].message
        })
      );
    }

    // Get admin ID from request body if provided
    const adminId = req.body.approved_by || null;

    const salaryStructure = await teacherSalaryStructureService.archiveSalaryStructure(
      req.params.id,
      adminId
    );

    return res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result: salaryStructure,
        message: 'Salary structure archived successfully'
      })
    );
  } catch (err) {
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || 'Something went wrong while archiving salary structure'
      })
    );
  }
};

module.exports = {
  createSalaryStructure,
  getAllSalaryStructures,  
  getSalaryStructureById,
  getSalaryStructuresByTeacherId,
  getActiveSalaryStructureByTeacherId,
  updateSalaryStructure,
  approveSalaryStructure,
  deleteSalaryStructure,
  archiveSalaryStructure
};


