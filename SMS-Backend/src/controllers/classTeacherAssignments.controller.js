 const assignmentsService = require("../services/classTeacherAssignments.service");
const statusCode = require("../enums/statusCode");
const {
  createAssignmentValidation,
  updateAssignmentValidation,
} = require("../validations/classTeacherAssignments.validations");

// ============= CLASS TEACHER ASSIGNMENTS =============

const createAssignment = async (req, res) => {
  try {
    const { error, value } = createAssignmentValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const assignment = await assignmentsService.createAssignment(value);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: assignment,
      message: "Assignment created successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to create assignment",
    });
  }
};

const getAllAssignments = async (req, res) => {
  try {
    const filters = {
      teacher_id: req.query.teacher_id,
      class_id: req.query.class_id,
      section_id: req.query.section_id,
      subject_id: req.query.subject_id,
      role: req.query.role,
      academic_year: req.query.academic_year,
      status: req.query.status,
    };

    const assignments = await assignmentsService.getAllAssignments(filters);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: assignments,
      message: "Assignments retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve assignments",
    });
  }
};

const getAssignmentById = async (req, res) => {
  try {
    const assignment = await assignmentsService.getAssignmentById(
      req.params.id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: assignment,
      message: "Assignment retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve assignment",
    });
  }
};

const getAssignmentsByTeacherId = async (req, res) => {
  try {
    const { teacher_id } = req.params;
    const { academic_year } = req.query;

    const assignments = await assignmentsService.getAssignmentsByTeacherId(
      teacher_id,
      academic_year
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: assignments,
      message: "Teacher assignments retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve teacher assignments",
    });
  }
};

const getAssignmentsByClassId = async (req, res) => {
  try {
    const { class_id } = req.params;
    const { academic_year } = req.query;

    const assignments = await assignmentsService.getAssignmentsByClassId(
      class_id,
      academic_year
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: assignments,
      message: "Class assignments retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve class assignments",
    });
  }
};

const getAssignmentsByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const { academic_year } = req.query;

    const assignments = await assignmentsService.getAssignmentsByRole(
      role,
      academic_year
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: assignments,
      message: `${role} assignments retrieved successfully`,
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve assignments by role",
    });
  }
};

const getSubjectTeachers = async (req, res) => {
  try {
    const { subject_id } = req.params;
    const { academic_year } = req.query;

    const assignments = await assignmentsService.getSubjectTeachers(
      subject_id,
      academic_year
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: assignments,
      message: "Subject teachers retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve subject teachers",
    });
  }
};

const updateAssignment = async (req, res) => {
  try {
    const { error, value } = updateAssignmentValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const assignment = await assignmentsService.updateAssignment(
      req.params.id,
      value
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: assignment,
      message: "Assignment updated successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to update assignment",
    });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    const assignment = await assignmentsService.deleteAssignment(
      req.params.id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: assignment,
      message: "Assignment deleted successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to delete assignment",
    });
  }
};

const endAssignment = async (req, res) => {
  try {
    const { end_date } = req.body;
    const assignment = await assignmentsService.endAssignment(
      req.params.id,
      end_date ? new Date(end_date) : null
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: assignment,
      message: "Assignment ended successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {}, 
      message: err.message || "Failed to end assignment",
    });
  }
};

module.exports = {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  getAssignmentsByTeacherId,
  getAssignmentsByClassId,
  getAssignmentsByRole,
  getSubjectTeachers,
  updateAssignment,
  deleteAssignment,
  endAssignment,
};