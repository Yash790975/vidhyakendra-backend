const Joi = require('joi');

const createInstituteMasterValidation = Joi.object({
  institute_name: Joi.string().required(),
  institute_type: Joi.string().valid('school', 'coaching', 'both').required(),
  application_reference_id: Joi.string().allow('', null),
  status: Joi.string()
    .valid(
      'pending_activation',
      'trial',
      'active',
      'suspended',
      'blocked',
      'expired',
      'archived'
    )
    .default('pending_activation')
});

const updateInstituteMasterValidation = Joi.object({
  institute_name: Joi.string(),
  status: Joi.string().valid(
    'pending_activation',
    'trial',
    'active',
    'suspended',
    'blocked',
    'expired',
    'archived'
  )
}).min(1);

const createInstituteBasicInfoValidation = Joi.object({
  institute_id: Joi.string().hex().length(24).required(),
  owner_name: Joi.string().required(),
  designation: Joi.string().allow('', null),
  email: Joi.string().email().required(),
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  address: Joi.string().allow('', null),
  email_verified: Joi.boolean().default(false),
  mobile_verified: Joi.boolean().default(false)
});

const updateInstituteBasicInfoValidation = Joi.object({
  owner_name: Joi.string(),
  designation: Joi.string().allow('', null),
  email: Joi.string().email(),
  mobile: Joi.string().pattern(/^[0-9]{10}$/),
  address: Joi.string().allow('', null),
  email_verified: Joi.boolean(),
  mobile_verified: Joi.boolean()
}).min(1);

const createInstituteDetailsValidation = Joi.object({
  institute_id: Joi.string().hex().length(24).required(),
  school_board: Joi.string().allow('', null),
  school_type: Joi.string().valid('private', 'government', 'public').allow(null),
  classes_offered: Joi.array().items(Joi.string()),
  courses_offered: Joi.array().items(Joi.string()),
  medium: Joi.string().valid('english', 'hindi', 'other').allow(null),
  approx_students_range: Joi.string()
    .valid('1-100', '101-250', '251-500', '500-1000', '1000+')
    .allow(null)
});

const updateInstituteDetailsValidation = Joi.object({
  school_board: Joi.string().allow('', null),
  school_type: Joi.string().valid('private', 'government', 'public').allow(null),
  classes_offered: Joi.array().items(Joi.string()),
  courses_offered: Joi.array().items(Joi.string()),
  medium: Joi.string().valid('english', 'hindi', 'other').allow(null),
  approx_students_range: Joi.string()
    .valid('1-100', '101-250', '251-500', '500-1000', '1000+')
    .allow(null)
}).min(1);

module.exports = {
  createInstituteMasterValidation,
  updateInstituteMasterValidation,
  createInstituteBasicInfoValidation,
  updateInstituteBasicInfoValidation,
  createInstituteDetailsValidation,
  updateInstituteDetailsValidation
};