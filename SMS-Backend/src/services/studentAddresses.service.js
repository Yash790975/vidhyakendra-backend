const StudentAddresses = require("../models/studentAddresses.model");
const mongoose = require("mongoose");

const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");

const createAddress = async (addressData) => {
  // Check if address type already exists for this student
  const existing = await StudentAddresses.findOne({
    student_id: addressData.student_id,
    address_type: addressData.address_type,
  });

  if (existing) {
    throw new CustomError(
      `${addressData.address_type} address already exists for this student`,
      statusCode.CONFLICT
    );
  }

  // Check if address with address type 'permanent' or 'current' already exists for this student
  if (addressData.address_type === "permanent" || addressData.address_type === "current") {
    const existingAddress = await StudentAddresses.findOne({
      student_id: addressData.student_id,
      address_type: { $in: ["permanent", "current"] },
    });

    if (existingAddress) {
      throw new CustomError(
        `An address of type 'permanent' or 'current' already exists for this student`,
        statusCode.CONFLICT
      );
    }
  }

  const address = new StudentAddresses({
    student_id: new mongoose.Types.ObjectId(addressData.student_id),
    address_type: addressData.address_type,
    address: addressData.address,
    city: addressData.city,
    state: addressData.state,
    pincode: addressData.pincode,
  });

  await address.save();
  return address;
};

const getAllAddresses = async (filters = {}) => {
  const query = {};

  if (filters.student_id) query.student_id = filters.student_id;
  if (filters.address_type) query.address_type = filters.address_type;
  if (filters.city) query.city = new RegExp(filters.city, "i");
  if (filters.state) query.state = new RegExp(filters.state, "i");

  const addresses = await StudentAddresses.find(query)
    .populate("student_id", "full_name student_code")
    .sort({ createdAt: -1 });

  return addresses;
};

const getAddressById = async (addressId) => {
  const address = await StudentAddresses.findById(addressId).populate(
    "student_id",
    "full_name student_code"
  );

  if (!address) {
    throw new CustomError("Address not found", statusCode.NOT_FOUND);
  }

  return address;
};

const getAddressesByStudentId = async (studentId) => {
  const addresses = await StudentAddresses.find({ student_id: studentId })
  .populate("student_id", "full_name student_code")
  .sort(
    { address_type: 1 }
  ); 

  return addresses;
};

const getAddressByType = async (studentId, addressType) => {
  const address = await StudentAddresses.findOne({
    student_id: studentId,
    address_type: addressType,
  })
  .populate("student_id", "full_name student_code");

  if (!address) {
    throw new CustomError(
      `${addressType} address not found for this student`,
      statusCode.NOT_FOUND
    );
  }

  return address;
};

const updateAddress = async (addressId, updateData) => {
  const address = await StudentAddresses.findById(addressId);

  if (!address) {
    throw new CustomError("Address not found", statusCode.NOT_FOUND);
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      address[key] = updateData[key];
    }
  });

  await address.save();
  return await StudentAddresses.findById(addressId).populate(
    "student_id",
    "full_name student_code"
  );
};

const deleteAddress = async (addressId) => {
  const address = await StudentAddresses.findById(addressId);

  if (!address) {
    throw new CustomError("Address not found", statusCode.NOT_FOUND);
  }

  await StudentAddresses.findByIdAndDelete(addressId);
  return { message: "Address deleted successfully" };
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