// utils/apiResponse.js
function apiResponse({
  success = false,
  isException = false,
  statusCode = 500,
  result = null,
  message = ''
}) {
  return {
    success,
    isException,
    statusCode,
    result,
    message
  };
}

module.exports = apiResponse;
