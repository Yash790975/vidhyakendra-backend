const Joi = require("joi");

const createNoticeValidation = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "title is required",
  }),
  content: Joi.string().required().messages({
    "any.required": "content is required",
  }),
  fullDescription: Joi.string().required().messages({
    "any.required": "fullDescription is required",
  }),
  docUrl: Joi.string().uri().optional().allow(null, ""),
  instituteId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid instituteId format",
      "any.required": "instituteId is required",
    }),
  createdBy: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid createdBy format",
      "any.required": "createdBy is required",
    }),
  createdByRole: Joi.string()
    .valid("institute_admin", "teacher")
    .required()
    .messages({
      "any.only": "createdByRole must be institute_admin or teacher",
      "any.required": "createdByRole is required",
    }),
  audience: Joi.object({
    type: Joi.string()
      .valid("all", "teachers", "students", "specific-classes", "specific-users")
      .required()
      .messages({
        "any.only":
          "audience.type must be one of: all, teachers, students, specific-classes, specific-users",
        "any.required": "audience.type is required",
      }),
    classIds: Joi.array()
      .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
      .optional()
      .allow(null),
    sectionIds: Joi.array()
      .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
      .optional()
      .allow(null),
    batchIds: Joi.array()
      .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
      .optional()
      .allow(null),
    studentIds: Joi.array()
      .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
      .optional()
      .allow(null),
    teacherIds: Joi.array()
      .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
      .optional()
      .allow(null),
  }).required(),
  category: Joi.string()
    .valid("urgent", "academic", "events", "news")
    .required()
    .messages({
      "any.only": "category must be one of: urgent, academic, events, news",
      "any.required": "category is required",
    }),
  isPinned: Joi.boolean().optional().default(false),
  publishDate: Joi.date().optional().allow(null),
  expiryDate: Joi.date().optional().allow(null),
});

const updateNoticeValidation = Joi.object({
  title: Joi.string().optional(),
  content: Joi.string().optional(),
  fullDescription: Joi.string().optional(),
  docUrl: Joi.string().uri().optional().allow(null, ""),
  audience: Joi.object({
    type: Joi.string()
      .valid("all", "teachers", "students", "specific-classes", "specific-users")
      .optional()
      .messages({
        "any.only":
          "audience.type must be one of: all, teachers, students, specific-classes, specific-users",
      }),
    classIds: Joi.array()
      .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
      .optional()
      .allow(null),
    sectionIds: Joi.array()
      .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
      .optional()
      .allow(null),
    batchIds: Joi.array()
      .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
      .optional()
      .allow(null),
    studentIds: Joi.array()
      .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
      .optional()
      .allow(null),
    teacherIds: Joi.array()
      .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
      .optional()
      .allow(null),
  }).optional(),
  category: Joi.string()
    .valid("urgent", "academic", "events", "news")
    .optional()
    .messages({
      "any.only": "category must be one of: urgent, academic, events, news",
    }),
  isPinned: Joi.boolean().optional(),
  publishDate: Joi.date().optional().allow(null),
  expiryDate: Joi.date().optional().allow(null),
  status: Joi.string()
    .valid("draft", "published", "archived", "expired")
    .optional(),
});

module.exports = {
  createNoticeValidation,
  updateNoticeValidation,
};