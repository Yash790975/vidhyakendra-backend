const status=require("../enums/statusCode")
const notFound = (req, res, next) => {
  res.status(status.NOT_FOUND).json({ message: 'Route not found' });
};
module.exports = { notFound };
