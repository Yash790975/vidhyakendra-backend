const Joi = require("joi");


// Experience Validation
const createExperienceValidation = Joi.object({
  teacher_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  organization_name: Joi.string().required(),
  role: Joi.string().optional(),
  from_date: Joi.date().optional(),
  to_date: Joi.date().optional().allow(null),
  is_current: Joi.boolean().optional(),
});
 

module.exports = {

  createExperienceValidation,
  
};