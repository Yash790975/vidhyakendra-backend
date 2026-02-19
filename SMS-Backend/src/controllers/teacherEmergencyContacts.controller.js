 // src/controllers/teachers.controller.js (Part 1)

const teachersService = require("../services/teacherEmergencyContacts.service");
const statusCode = require("../enums/statusCode");
const {
  createEmergencyContactValidation
} = require("../validations/teacherEmergencyContacts.validations"); 

// ============= EMERGENCY CONTACTS ============= 

const createEmergencyContact = async (req, res) => { 
  try {
    const { error, value } = createEmergencyContactValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message, 
      });
    }

    const contact = await teachersService.createEmergencyContact(value);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: contact,
      message: "Emergency contact created successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to create emergency contact",
    });
  }
};

const getEmergencyContactsByTeacherId = async (req, res) => {
  try {
    const contacts = await teachersService.getEmergencyContactsByTeacherId(
      req.params.teacher_id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: contacts,
      message: "Emergency contacts retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve emergency contacts",
    });
  }
};

const updateEmergencyContact = async (req, res) => {
  try {
    const contact = await teachersService.updateEmergencyContact(
      req.params.id,
      req.body
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: contact,
      message: "Emergency contact updated successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to update emergency contact",
    });
  }
};

const deleteEmergencyContact = async (req, res) => {
  try {
    const contact = await teachersService.deleteEmergencyContact(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: contact,
      message: "Emergency contact deleted successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to delete emergency contact",
    });
  }
};

const getAllEmergencyContacts = async (req, res) => {
  try {
    const contacts = await teachersService.getAllEmergencyContacts();

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: contacts,
      message: "All emergency contacts retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve emergency contacts",
    });
  }
};

const getEmergencyContactById = async (req, res) => {
  try {
    const contact = await teachersService.getEmergencyContactById(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: contact,
      message: "Emergency contact retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve emergency contact",
    });
  }
};




module.exports = {
  // Emergency Contacts
  createEmergencyContact,
  getAllEmergencyContacts,
  getEmergencyContactById,
  getEmergencyContactsByTeacherId,
  updateEmergencyContact,
  deleteEmergencyContact,
};
