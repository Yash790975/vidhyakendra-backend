const teachersService = require("../services/teacherAddresses.service");
const statusCode = require("../enums/statusCode");
const {
  createAddressValidation
} = require("../validations/teacherAddresses.validations");


// ============= ADDRESS =============
const createAddress = async (req, res) => { 
  try {
    const { error, value } = createAddressValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const address = await teachersService.createAddress(value);

    res.status(statusCode.CREATED).json({
      success: true,
      isException: false,
      statusCode: statusCode.CREATED,
      result: address,
      message: "Address created successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to create address",
    });
  }
};

const getAddressesByTeacherId = async (req, res) => {
  try {
    const addresses = await teachersService.getAddressesByTeacherId( 
      req.params.teacher_id
    ); 

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: addresses,
      message: "Addresses retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve addresses",
    });
  }
};


const updateAddress = async (req, res) => {
  try {
    const address = await teachersService.updateAddress(req.params.id, req.body);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: address,
      message: "Address updated successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to update address",
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const address = await teachersService.deleteAddress(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: address,
      message: "Address deleted successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to delete address",
    });
  }
};

const getAddressById = async (req, res) => {
  try {
    const address = await teachersService.getAddressById(req.params.id);

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: address,
      message: "Address retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve address",
    });
  }
};

const getAllAddresses = async (req, res) => {
  try {
    const addresses = await teachersService.getAllAddresses();

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: addresses,
      message: "All addresses retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve addresses",
    });
  }
};



module.exports = {

  // Address
createAddress,
getAddressById,
  getAllAddresses,
getAddressesByTeacherId, 
updateAddress,
deleteAddress 
};