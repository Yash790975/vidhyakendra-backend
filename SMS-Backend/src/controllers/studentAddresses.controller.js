const addressService = require("../services/studentAddresses.service.js");
const statusCode = require("../enums/statusCode");
const {
  createAddressValidation,
  updateAddressValidation,
} = require("../validations/studentAddresses.validations.js");

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

    const address = await addressService.createAddress(value);

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

const getAllAddresses = async (req, res) => {
  try {
    const filters = {
      student_id: req.query.student_id,
      address_type: req.query.address_type,
      city: req.query.city,
      state: req.query.state,
    };

    const addresses = await addressService.getAllAddresses(filters);

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

const getAddressById = async (req, res) => {
  try {
    const address = await addressService.getAddressById(req.params.id);

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

const getAddressesByStudentId = async (req, res) => {
  try {
    const addresses = await addressService.getAddressesByStudentId(
      req.params.student_id
    );

    res.status(statusCode.OK).json({
      success: true,
      isException: false,
      statusCode: statusCode.OK,
      result: addresses,
      message: "Student addresses retrieved successfully",
    });
  } catch (err) {
    res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      isException: err.exception || true,
      statusCode: err.statusCode || statusCode.INTERNAL_SERVER_ERROR,
      result: {},
      message: err.message || "Failed to retrieve student addresses",
    });
  }
};

const getAddressByType = async (req, res) => {
  try {
    const address = await addressService.getAddressByType(
      req.params.student_id,
      req.params.address_type
    );

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

const updateAddress = async (req, res) => {
  try {
    const { error, value } = updateAddressValidation.validate(req.body);
    if (error) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        isException: false,
        statusCode: statusCode.BAD_REQUEST,
        result: {},
        message: error.details[0].message,
      });
    }

    const address = await addressService.updateAddress(req.params.id, value);

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
    const result = await addressService.deleteAddress(req.params.id);

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
      message: err.message || "Failed to delete address",
    });
  }
};

module.exports = {
  createAddress,
  getAllAddresses,
  getAddressById,
  getAddressesByStudentId,
  getAddressByType,
  updateAddress,
  deleteAddress,
};