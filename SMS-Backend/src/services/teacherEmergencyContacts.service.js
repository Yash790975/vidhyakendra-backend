
const TeacherEmergencyContacts = require("../models/teacherEmergencyContacts.model");
const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode"); 

// ============= EMERGENCY CONTACTS ============= 

const createEmergencyContact = async (contactData) => {
  const emergencyContact = new TeacherEmergencyContacts(contactData);
  await emergencyContact.save();
  return emergencyContact;  
};

const getEmergencyContactsByTeacherId = async (teacherId) => {
  const contacts = await TeacherEmergencyContacts.find({
    teacher_id: teacherId,
  }).populate("teacher_id", "full_name teacher_code");

  return contacts;
};

const updateEmergencyContact = async (contactId, updateData) => {
  const contact = await TeacherEmergencyContacts.findByIdAndUpdate(
    contactId,
    updateData,
    { new: true }
  );

  if (!contact) {
    throw new CustomError("Emergency contact not found", statusCode.NOT_FOUND);
  }
 
  return contact;
}; 

const deleteEmergencyContact = async (contactId) => {
  const contact = await TeacherEmergencyContacts.findByIdAndDelete(contactId);

  if (!contact) {
    throw new CustomError("Emergency contact not found", statusCode.NOT_FOUND);
  }

  return contact;
};

// ============= EMERGENCY CONTACTS ============= 

const getAllEmergencyContacts = async () => {
  const contacts = await TeacherEmergencyContacts.find()
  .populate("teacher_id", "full_name teacher_code");
  return contacts;
};

const getEmergencyContactById = async (contactId) => {
  const contact = await TeacherEmergencyContacts.findById(contactId)
  .populate("teacher_id", "full_name teacher_code");

  if (!contact) {
    throw new CustomError("Emergency contact not found", statusCode.NOT_FOUND);
  }

  return contact;
};

module.exports = {
  // Emergency Contacts
  createEmergencyContact,
  getAllEmergencyContacts,
  getEmergencyContactById,
  getEmergencyContactsByTeacherId,
  updateEmergencyContact,
  deleteEmergencyContact,
};
