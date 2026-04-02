const InstituteDetails = require('../models/instituteDetails.model');

const createInstituteDetails = async (detailsData) => {
  const details = new InstituteDetails(detailsData);
  return await details.save(); 
};
 
const getAllInstituteDetails = async () => {
  return await InstituteDetails.find()
    .populate('institute_id')
    .sort({ createdAt: -1 });
};

const getInstituteDetailsById = async (id) => {
  return await InstituteDetails.findById(id).populate('institute_id');
};

const getInstituteDetailsByInstituteId = async (institute_id) => {
  return await InstituteDetails.findOne({ institute_id }).populate(
    'institute_id'
  );
};

const getInstituteDetailsBySchoolBoard = async (school_board) => {
  return await InstituteDetails.find({ school_board })
    .populate('institute_id')
    .sort({ createdAt: -1 });
};

const getInstituteDetailsBySchoolType = async (school_type) => {
  return await InstituteDetails.find({ school_type })
    .populate('institute_id')
    .sort({ createdAt: -1 });
};

const getInstituteDetailsByMedium = async (medium) => {
  return await InstituteDetails.find({ medium })
    .populate('institute_id')
    .sort({ createdAt: -1 });
};

const getInstituteDetailsByStudentsRange = async (approx_students_range) => {
  return await InstituteDetails.find({ approx_students_range })
    .populate('institute_id')
    .sort({ createdAt: -1 });
};

const updateInstituteDetails = async (id, updateData) => {
  return await InstituteDetails.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  }).populate('institute_id');
};

const deleteInstituteDetails = async (id) => {
  return await InstituteDetails.findByIdAndDelete(id);
};

module.exports = {
  createInstituteDetails,
  getAllInstituteDetails,
  getInstituteDetailsById,
  getInstituteDetailsByInstituteId,
  getInstituteDetailsBySchoolBoard,
  getInstituteDetailsBySchoolType,
  getInstituteDetailsByMedium,
  getInstituteDetailsByStudentsRange,
  updateInstituteDetails,
  deleteInstituteDetails
};