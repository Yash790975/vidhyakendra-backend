const Joi = require("joi");

const createSectionValidation = Joi.object({
  class_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid class_id format",
      "any.required": "class_id is required",
    }),
  section_name: Joi.string().required().messages({
    "any.required": "section_name is required",
  }),
  class_teacher_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base": "Invalid class_teacher_id format",
    }),
  class_capacity: Joi.number().integer().min(1).optional().allow(null).messages({
    "number.base": "class_capacity must be a number",
    "number.integer": "class_capacity must be an integer",
    "number.min": "class_capacity must be at least 1",
  }),
});

const updateSectionValidation = Joi.object({
  section_name: Joi.string().optional(),
  class_teacher_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base": "Invalid class_teacher_id format",
    }),
  class_capacity: Joi.number().integer().min(1).optional().allow(null).messages({
    "number.base": "class_capacity must be a number",
    "number.integer": "class_capacity must be an integer",
    "number.min": "class_capacity must be at least 1",
  }),
  status: Joi.string().valid("active", "inactive", "archived").optional(),
});

module.exports = {
  createSectionValidation,
  updateSectionValidation,
};



















































































// const Joi = require("joi");

// const createSectionValidation = Joi.object({
//   class_id: Joi.string()
//     .pattern(/^[0-9a-fA-F]{24}$/)
//     .required()
//     .messages({
//       "string.pattern.base": "Invalid class_id format",
//       "any.required": "class_id is required",
//     }),
//   section_name: Joi.string().required().messages({
//     "any.required": "section_name is required",
//   }),
//   class_teacher_id: Joi.string()
//     .pattern(/^[0-9a-fA-F]{24}$/)
//     .required()
//     .messages({
//       "string.pattern.base": "Invalid class_teacher_id format",
//       "any.required": "class_teacher_id is required",
//     }),
// });

// const updateSectionValidation = Joi.object({
//   section_name: Joi.string().optional(),
//   class_teacher_id: Joi.string()
//     .pattern(/^[0-9a-fA-F]{24}$/)
//     .optional()
//     .allow(null, "")
//     .messages({
//       "string.pattern.base": "Invalid class_teacher_id format",
//     }),
//   status: Joi.string()
//     .valid("active", "inactive", "archived")
//     .optional(),
// });

// module.exports = {
//   createSectionValidation,
//   updateSectionValidation,
// };