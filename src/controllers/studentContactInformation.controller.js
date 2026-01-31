const studentsService = require("../services/studentContactInformation.service");
const statusCode = require("../enums/statusCode");
const {
  createContactValidation,
  updateContactValidation,
  verifyOTPValidation,
} = require("../validations/studentContactInformation.validations");

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

    const contact = await studentsService.createContact(value);

    const message = value.email
      ? "Contact information created successfully. OTP sent to email."
      : "Contact information created successfully.";

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: contact,
      message: message,
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

    const contact = await studentsService.verifyOTP(value.email, value.otp);

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

    const result = await studentsService.resendOTP(email);

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

const getContactByStudentId = async (req, res) => {
  try {
    const contact = await studentsService.getContactByStudentId(
      req.params.student_id
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

const getAllContactsByStudentId = async (req, res) => {
  try {
    const contacts = await studentsService.getAllContactsByStudentId(
      req.params.student_id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: contacts,
      message: "All contacts retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve contacts",
    });
  }
};

const getPrimaryContactByStudentId = async (req, res) => {
  try {
    const contact = await studentsService.getPrimaryContactByStudentId(
      req.params.student_id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: contact,
      message: "Primary contact retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve primary contact",
    });
  }
};

const updateContact = async (req, res) => {
  try {
    const { error, value } = updateContactValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const contact = await studentsService.updateContact(req.params.id, value);

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

const getAllStudentsContacts = async (req, res) => {
  try {
    const contacts = await studentsService.getAllStudentsContacts(req.query);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: contacts,
      message: "All student contacts retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve student contacts",
    });
  }
};

const deleteContact = async (req, res) => {
  try {
    const result = await studentsService.deleteContact(req.params.id);

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
  getContactByStudentId,
  getAllContactsByStudentId,
  getPrimaryContactByStudentId,
  updateContact,
  getAllStudentsContacts,
  deleteContact,
};











































































// const studentsService = require("../services/studentContactInformation.service");
// const statusCode = require("../enums/statusCode");
// const {
//   createContactValidation, 
//   verifyOTPValidation,
// } = require("../validations/studentContactInformation.validations");

// // ============= CONTACT INFORMATION =============

// const createContact = async (req, res) => {
//   try {
//     const { error, value } = createContactValidation.validate(req.body);
//     if (error) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: {},
//         message: error.details[0].message,
//       });
//     }

//     const contact = await studentsService.createContact(value);

//     const message = value.email
//       ? "Contact information created successfully. OTP sent to email."
//       : "Contact information created successfully.";

//     res.status(statusCode.CREATED).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.CREATED,
//       result: contact,
//       message: message,
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to create contact information",
//     });
//   }
// };

// const verifyOTP = async (req, res) => {
//   try {
//     const { error, value } = verifyOTPValidation.validate(req.body);
//     if (error) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: {},
//         message: error.details[0].message,
//       });
//     }

//     const contact = await studentsService.verifyOTP(value.email, value.otp);

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: contact,
//       message: "Email and mobile verified successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to verify OTP",
//     });
//   }
// };

// const resendOTP = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(statusCode.BAD_REQUEST).json({
//         success: false,
//         isException: false,
//         statusCode: statusCode.BAD_REQUEST,
//         result: {},
//         message: "Email is required",
//       });
//     }

//     const result = await studentsService.resendOTP(email);

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: {},
//       message: result.message,
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to resend OTP",
//     });
//   }
// };

// const getContactByStudentId = async (req, res) => {
//   try {
//     const contact = await studentsService.getContactByStudentId(
//       req.params.student_id
//     );

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: contact,
//       message: "Contact information retrieved successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to retrieve contact information",
//     });
//   }
// };

// const updateContact = async (req, res) => {
//   try {
//     const contact = await studentsService.updateContact(
//       req.params.student_id,
//       req.body
//     );

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: contact,
//       message: "Contact information updated successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to update contact information",
//     });
//   }
// };

// const getAllStudentsContacts = async (req, res) => {
//   try {
//     const contacts = await studentsService.getAllStudentsContacts(req.query);

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: contacts,
//       message: "All student contacts retrieved successfully",
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to retrieve student contacts",
//     });
//   }
// };

// const deleteContact = async (req, res) => {
//   try {
//     const result = await studentsService.deleteContact(req.params.student_id);

//     res.status(statusCode.OK).json({
//       success: true,
//       isException: false,
//       statusCode: statusCode.OK,
//       result: {},
//       message: result.message,
//     });
//   } catch (err) {
//     res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       isException: err.exception || true,
//       statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
//       result: {},
//       message: err.message || "Failed to delete contact information",
//     });
//   }
// };

// module.exports = {
//   // Contact Information
//   createContact,
//   verifyOTP,
//   resendOTP,
//   getContactByStudentId,
//   updateContact,
//   getAllStudentsContacts,
//   deleteContact,
// };