const teachersService = require("../services/teacherContactInformation.service");
const statusCode = require("../enums/statusCode");   
const {
  createContactValidation,
  verifyOTPValidation
} = require("../validations/teacherContactInformation.validations");

 

// ============= CONTACT INFORMATION =============

const createContact = async (req, res) => {
  try {
    const { error, value } = createContactValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const contact = await teachersService.createContact(value);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: contact,
      message: "Contact information created successfully. OTP sent to email.",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to create contact information",
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { error, value } = verifyOTPValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    // 🔁 Now verify using EMAIL instead of teacher_id
    const contact = await teachersService.verifyOTP(
      value.email,
      value.otp
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: contact,
      message: "Email and mobile verified successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to verify OTP",
    });
  }
};


const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: "Email is required",
      });
    }

    const result = await teachersService.resendOTP(email);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: {},
      message: result.message,
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to resend OTP",
    });
  }
};


const getContactByTeacherId = async (req, res) => {
  try {
    const contact = await teachersService.getContactByTeacherId(
      req.params.teacher_id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: contact,
      message: "Contact information retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve contact information",
    });
  }
};

const updateContact = async (req, res) => {
  try {
    const contact = await teachersService.updateContact(
      req.params.teacher_id,
      req.body
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: contact,
      message: "Contact information updated successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to update contact information",
    });
  }
};

const getAllTeachersContacts = async (req, res) => {
  try {
    const contacts = await teachersService.getAllTeachersContacts(req.query);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: contacts,
      message: "All teacher contacts retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve teacher contacts",
    });
  }
};

const deleteContact = async (req, res) => {
  try {
    const result = await teachersService.deleteContact(req.params.teacher_id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: {},
      message: result.message,
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to delete contact information",
    });
  }
};



module.exports = {

  // Contact Information
  createContact,
  verifyOTP,
  resendOTP,
  getContactByTeacherId,
  updateContact,
  getAllTeachersContacts,
  deleteContact
}; 