// src/exceptions/customError.js
class CustomError extends Error {
  constructor(message, statusCode = 500, exception = false, details = []) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.result = {};
    this.exception = exception;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
