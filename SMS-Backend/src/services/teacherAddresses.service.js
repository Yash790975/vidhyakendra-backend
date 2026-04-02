
const TeacherAddresses = require("../models/teacherAddresses.model");
const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");

// ============= ADDRESS =============
    
const createAddress = async (addressData) => {
  const address = new TeacherAddresses(addressData);
  await address.save();
  return address;
}; 

const getAddressesByTeacherId = async (teacherId) => {
  const addresses = await TeacherAddresses.find({ teacher_id: teacherId });
  return addresses;
};


const updateAddress = async (addressId, updateData) => {
  const address = await TeacherAddresses.findByIdAndUpdate(
    addressId,
    updateData,
    { new: true } 
  );

  if (!address) {
    throw new CustomError("Address not found", statusCode.NOT_FOUND);
  }

  return address;
}; 

const deleteAddress = async (addressId) => {
  const address = await TeacherAddresses.findByIdAndDelete(addressId);

  if (!address) {
    throw new CustomError("Address not found", statusCode.NOT_FOUND);
  }

  return address;
};

const getAddressById = async (addressId) => {
  const address = await TeacherAddresses.findById(addressId);

  if (!address) {
    throw new CustomError("Address not found", statusCode.NOT_FOUND);
  }

  return address;
};

const getAllAddresses = async () => {
  const addresses = await TeacherAddresses.find()
  .populate("teacher_id", "full_name teacher_code")
  return addresses;
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