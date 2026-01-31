const apiResponse = require('../utils/apiResponse');

const validate = (schema) => (req, res, next) => {
  console.log("Body : ",req.body);
  const { error } = schema.validate(req.body, { abortEarly: false });
console.log("Error : ",error);
  if (error) {
    const message = error.details[0]?.message || 'Validation error';
    return res.status(400).json(
      apiResponse({
        success: false,
        isException: true,
        statusCode: 400,
        result: null,
        message
      })
    );
  }

  next();
};

module.exports = validate;
