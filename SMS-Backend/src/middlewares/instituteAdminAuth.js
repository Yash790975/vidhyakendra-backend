// src/middlewares/instituteAdminAuth.js

const jwt = require('jsonwebtoken');
const statusCode = require('../enums/statusCode');
const apiResponse = require('../utils/apiResponse');   

const verifyInstituteAdminToken = async (req, res, next) => {  
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(statusCode.UNAUTHORIZED).json(
        apiResponse({
          success: false,
          isException: false,
          statusCode: statusCode.UNAUTHORIZED,
          result: null,
          message: 'No token provided. Authorization required.'
        })
      );
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(statusCode.UNAUTHORIZED).json(
        apiResponse({
          success: false,
          isException: false,
          statusCode: statusCode.UNAUTHORIZED,
          result: null,
          message: 'Invalid token format'
        })
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_INSTITUTE_ADMIN || process.env.JWT_SECRET);
    
    // Attach institute admin info to request
    req.instituteAdmin = {
      _id: decoded._id,
      email: decoded.email,
      name: decoded.name,
      institute_id: decoded.institute_id
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(statusCode.UNAUTHORIZED).json(
        apiResponse({
          success: false,
          isException: false,
          statusCode: statusCode.UNAUTHORIZED,
          result: null,
          message: 'Invalid token'
        })
      );
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(statusCode.UNAUTHORIZED).json(
        apiResponse({
          success: false,
          isException: false,
          statusCode: statusCode.UNAUTHORIZED,
          result: null,
          message: 'Token expired. Please login again.'
        })
      );
    }

    return res.status(statusCode.UNAUTHORIZED).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: statusCode.UNAUTHORIZED,
        result: null,
        message: error.message || 'Authentication failed'
      })
    );
  }
};

module.exports = {
  verifyInstituteAdminToken
};