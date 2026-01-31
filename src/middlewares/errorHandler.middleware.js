// middlewares/errorHandler.middleware.js
const { apiResponse } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json(
    apiResponse({
      success: false,
      isException: true,
      statusCode,
      result: null,
      message,
    })
  );
};

module.exports = errorHandler;
