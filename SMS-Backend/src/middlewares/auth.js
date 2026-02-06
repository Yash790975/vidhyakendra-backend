// src/middlewares/auth.js

const jwt = require('jsonwebtoken');
const statusCode = require('../enums/statusCode');
const apiResponse = require('../utils/apiResponse');

const verifyAdminToken = async (req, res, next) => {
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach admin info to request
    req.admin = {
      _id: decoded._id,
      email: decoded.email,
      name: decoded.name
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
  verifyAdminToken
};