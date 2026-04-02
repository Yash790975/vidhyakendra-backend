const InstituteBasicInformation = require('../models/instituteBasicInformation.model');

const createInstituteBasicInfo = async (basicInfoData) => {
  const basicInfo = new InstituteBasicInformation(basicInfoData);
  return await basicInfo.save(); 
};

const getAllInstituteBasicInfo = async () => {
  return await InstituteBasicInformation.find()
    .populate('institute_id')
    .sort({ createdAt: -1 }); 
};

const getInstituteBasicInfoById = async (id) => {
  return await InstituteBasicInformation.findById(id).populate('institute_id');
};

const getInstituteBasicInfoByInstituteId = async (institute_id) => {
  return await InstituteBasicInformation.findOne({ institute_id }).populate(
    'institute_id'
  );
};

const getVerifiedInstituteBasicInfo = async () => {
  return await InstituteBasicInformation.find({
    mobile_verified: true, 
    email_verified: true
  })
    .populate('institute_id')
    .sort({ createdAt: -1 });
};

const updateInstituteBasicInfo = async (id, updateData) => {
  return await InstituteBasicInformation.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  }).populate('institute_id');
};

const deleteInstituteBasicInfo = async (id) => {
  return await InstituteBasicInformation.findByIdAndDelete(id);
};

module.exports = {
  createInstituteBasicInfo,
  getAllInstituteBasicInfo,
  getInstituteBasicInfoById,
  getInstituteBasicInfoByInstituteId,
  getVerifiedInstituteBasicInfo,
  updateInstituteBasicInfo,
  deleteInstituteBasicInfo
};