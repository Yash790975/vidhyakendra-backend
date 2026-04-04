const Joi = require("joi");

const objectIdPattern = /^[0-9a-fA-F]{24}$/;
const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
const academicYearPattern = /^\d{4}-\d{2}$/;


//  CREATE VALIDATION
const createScheduleValidation = Joi.object({
  class_id: Joi.string().pattern(objectIdPattern).required().messages({
    "string.pattern.base": "Invalid class_id format",
    "any.required": "class_id is required",
  }),

  section_id: Joi.string()
    .pattern(objectIdPattern)
    .allow(null, "")
    .messages({ "string.pattern.base": "Invalid section_id format" }),

  batch_id: Joi.string()
    .pattern(objectIdPattern)
    .allow(null, "")
    .messages({ "string.pattern.base": "Invalid batch_id format" }),

  subject_id: Joi.string().pattern(objectIdPattern).required().messages({
    "string.pattern.base": "Invalid subject_id format",
    "any.required": "subject_id is required",
  }),

  teacher_id: Joi.string()
    .pattern(objectIdPattern)
    .allow(null, "")
    .messages({ "string.pattern.base": "Invalid teacher_id format" }),

  academic_year: Joi.string()
    .pattern(academicYearPattern)
    .required()
    .messages({
      "string.pattern.base":
        "academic_year must be in format YYYY-YY (e.g., 2025-26)",
      "any.required": "academic_year is required",
    }),

  day_of_week: Joi.string()
    .valid("mon", "tue", "wed", "thu", "fri", "sat")
    .required()
    .messages({
      "any.only": "day_of_week must be mon-sat",
      "any.required": "day_of_week is required",
    }),

  start_time: Joi.string()
    .pattern(timePattern)
    .required()
    .messages({
      "string.pattern.base": "start_time must be HH:MM",
      "any.required": "start_time is required",
    }),

  end_time: Joi.string()
    .pattern(timePattern)
    .required()
    .messages({
      "string.pattern.base": "end_time must be HH:MM",
      "any.required": "end_time is required",
    }),

  room_number: Joi.string().allow(null, ""),
})
.custom((value, helpers) => {
  if (!value.batch_id && !value.section_id) {
    return helpers.message("Either batch_id or section_id is required");
  }

  if (value.batch_id && value.section_id) {
    return helpers.message("Only one of batch_id or section_id should be provided");
  }

  return value; 
});


//  UPDATE VALIDATION
const updateScheduleValidation = Joi.object({
  section_id: Joi.string()
    .pattern(objectIdPattern)
    .allow(null, ""),

  batch_id: Joi.string()
    .pattern(objectIdPattern)
    .allow(null, ""),

  subject_id: Joi.string().pattern(objectIdPattern),

  teacher_id: Joi.string()
    .pattern(objectIdPattern)
    .allow(null, ""),

  academic_year: Joi.string().pattern(academicYearPattern),

  day_of_week: Joi.string().valid(
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat"
  ),

  start_time: Joi.string().pattern(timePattern),

  end_time: Joi.string().pattern(timePattern),

  room_number: Joi.string().allow(null, ""),
  status: Joi.string().valid("active", "inactive"),
})
.custom((value, helpers) => {
  if (value.batch_id && value.section_id) {
    return helpers.message("Only one of batch_id or section_id should be provided");
  }

  return value;
});


module.exports = {
  createScheduleValidation,
  updateScheduleValidation,
};



















































































// const Joi = require("joi");

// const objectIdPattern = /^[0-9a-fA-F]{24}$/;
// const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
// const academicYearPattern = /^\d{4}-\d{2}$/;

// const createScheduleValidation = Joi.object({
//   class_id: Joi.string()
//     .pattern(objectIdPattern)
//     .required()
//     .messages({
//       "string.pattern.base": "Invalid class_id format",
//       "any.required": "class_id is required", 
//     }),
//   section_id: Joi.string()
//     .pattern(objectIdPattern)
//     .optional()
//     .allow(null, "")
//     .messages({ "string.pattern.base": "Invalid section_id format" }),
//   batch_id: Joi.string()                           //  NEW
//     .pattern(objectIdPattern)
//     .optional()
//     .allow(null, "")
//     .messages({ "string.pattern.base": "Invalid batch_id format" }),
//   subject_id: Joi.string()
//     .pattern(objectIdPattern)
//     .required()
//     .messages({
//       "string.pattern.base": "Invalid subject_id format",
//       "any.required": "subject_id is required",
//     }),
//   teacher_id: Joi.string()
//     .pattern(objectIdPattern)
//     .optional()
//     .allow(null, "")
//     .messages({ "string.pattern.base": "Invalid teacher_id format" }),
//   academic_year: Joi.string()
//     .pattern(academicYearPattern)
//     .required()
//     .messages({
//       "string.pattern.base": "academic_year must be in format YYYY-YY (e.g., 2025-26)",
//       "any.required": "academic_year is required",
//     }),
//   day_of_week: Joi.string()
//     .valid("mon", "tue", "wed", "thu", "fri", "sat")
//     .optional()
//     .allow(null, "")
//     .messages({
//       "any.only": "day_of_week must be one of: mon, tue, wed, thu, fri, sat",
//     }),
//   start_time: Joi.string()
//     .pattern(timePattern)
//     .required()
//     .messages({
//       "string.pattern.base": "start_time must be in HH:MM format (e.g., 08:00)",
//       "any.required": "start_time is required",
//     }),
//   end_time: Joi.string()
//     .pattern(timePattern)
//     .required()
//     .messages({
//       "string.pattern.base": "end_time must be in HH:MM format (e.g., 10:00)",
//       "any.required": "end_time is required",
//     }),
//   room_number: Joi.string().optional().allow(null, ""),
// });

// const updateScheduleValidation = Joi.object({
//   section_id: Joi.string()
//     .pattern(objectIdPattern)
//     .optional()
//     .allow(null, "")
//     .messages({ "string.pattern.base": "Invalid section_id format" }),
//   batch_id: Joi.string()                           //  NEW
//     .pattern(objectIdPattern)
//     .optional()
//     .allow(null, "")
//     .messages({ "string.pattern.base": "Invalid batch_id format" }),
//   subject_id: Joi.string()
//     .pattern(objectIdPattern)
//     .optional()
//     .messages({ "string.pattern.base": "Invalid subject_id format" }),
//   teacher_id: Joi.string()
//     .pattern(objectIdPattern)
//     .optional()
//     .allow(null, "")
//     .messages({ "string.pattern.base": "Invalid teacher_id format" }),
//   academic_year: Joi.string()
//     .pattern(academicYearPattern)
//     .optional()
//     .messages({
//       "string.pattern.base": "academic_year must be in format YYYY-YY (e.g., 2025-26)",
//     }),
//   day_of_week: Joi.string()
//     .valid("mon", "tue", "wed", "thu", "fri", "sat")
//     .optional()
//     .allow(null, "")
//     .messages({
//       "any.only": "day_of_week must be one of: mon, tue, wed, thu, fri, sat",
//     }),
//   start_time: Joi.string()
//     .pattern(timePattern)
//     .optional()
//     .messages({
//       "string.pattern.base": "start_time must be in HH:MM format (e.g., 08:00)",
//     }),
//   end_time: Joi.string()
//     .pattern(timePattern)
//     .optional()
//     .messages({
//       "string.pattern.base": "end_time must be in HH:MM format (e.g., 10:00)",
//     }),
//   room_number: Joi.string().optional().allow(null, ""),
//   status: Joi.string().valid("active", "inactive").optional(),
// });

// module.exports = {
//   createScheduleValidation,
//   updateScheduleValidation,
// };

 