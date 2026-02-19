const adminService = require("../services/admin.service");
const apiResponse = require("../utils/apiResponse");
const statusCode = require("../enums/statusCode");
const jwt = require('jsonwebtoken'); 
 
exports.add = async (req, res) => {  
  try {
    const result = await adminService.add(req.body); 
    res.status(statusCode.CREATED).json(
      apiResponse({
        success: true, 
        isException: false,
        statusCode: statusCode.CREATED,
        result,
        message: "Admin added successfully. Temporary password sent via email.",
      })
    ); 
  } catch (err) {
    console.error("Add Admin Error:", err);
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || "Something went wrong while adding admin",
      })
    );
  }
};

exports.update = async (req, res) => {
  try {
    const result = await adminService.update(req.body);
    res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result,
        message: "Admin updated successfully",
      })
    );
  } catch (err) {
    console.error("Update Admin Error:", err);
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || "Something went wrong while updating admin",
      })
    );
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await adminService.getById(req.params.id);
    res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result,
        message: "Admin retrieved successfully",
      })
    );
  } catch (err) {
    console.error("Get Admin By ID Error:", err);
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || "Failed to retrieve admin",
      })
    );
  }
};

exports.getAll = async (req, res) => {
  try {
    const result = await adminService.getAll();
    res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        result,
        message: "All admins retrieved successfully",
      })
    );
  } catch (err) {
    console.error("Get All Admins Error:", err);
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || "Failed to retrieve admins",
      })
    );
  }
};

exports.remove = async (req, res) => {
  try {
    await adminService.remove(req.params.id);
    res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        message: "Admin deleted successfully",
      })
    );
  } catch (err) {
    console.error("Remove Admin Error:", err);
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || "Failed to delete admin",
      })
    );
  }
};

// ============== UPDATED LOGIN WITH JWT TOKEN ==============
exports.verifyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await adminService.verifyLogin(email, password); 
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        _id: admin._id,
        email: admin.email, 
        name: admin.name
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' } 
    );

    // Return admin data with token
    res.status(statusCode.OK).json(
      apiResponse({
        success: true,   
        isException: false,
        statusCode: statusCode.OK,
        result: {
          admin,
          token  
        },
        message: "Login successful",
      })
    );
  } catch (err) {
    console.error("Admin Login Error:", err);
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        result: null,
        message: err.message || "Login failed",
      })
    );
  }
};

exports.requestOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const message = await adminService.requestOTP(email);
    res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        message,
      })
    );
  } catch (err) {
    console.error("Request OTP Error:", err);
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        message: err.message || "Failed to request OTP",
      })
    );
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const message = await adminService.verifyOTP(email, otp);
    res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        message,
      })
    );
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        message: err.message || "Failed to verify OTP",
      })
    );
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { email, newPassword, otp } = req.body;
    const message = await adminService.changePassword(email, newPassword, otp);
    res.status(statusCode.OK).json(
      apiResponse({
        success: true,
        isException: false,
        statusCode: statusCode.OK,
        message,
      })
    );
  } catch (err) {
    console.error("Change Password Error:", err);
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
        message: err.message || "Failed to change password",
      })
    );
  }
};





