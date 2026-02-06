const Joi = require("joi");

const createSuperAdminNoticeValidation = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "title is required",
  }),
  content: Joi.string().required().messages({
    "any.required": "content is required",
  }),
  fullDescription: Joi.string().optional().allow(null, ""),
  docUrl: Joi.string().uri().optional().allow(null, ""),
  createdBy: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid createdBy format",
      "any.required": "createdBy is required",
    }),
  audience: Joi.object({
    type: Joi.string()
      .valid("all-institutes", "specific-institutes")
      .required()
      .messages({
        "any.only": "audience.type must be all-institutes or specific-institutes",
        "any.required": "audience.type is required",
      }),
    instituteIds: Joi.array()
      .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
      .optional()
      .allow(null)
      .messages({
        "string.pattern.base": "Invalid institute ID format in instituteIds",
      }),
  }).required(),
  priority: Joi.string()
    .valid("low", "medium", "high", "urgent")
    .required()
    .messages({
      "any.only": "priority must be one of: low, medium, high, urgent",
      "any.required": "priority is required",
    }),
  category: Joi.string()
    .valid("academic", "event", "announcement", "news")
    .required()
    .messages({
      "any.only": "category must be one of: academic, event, announcement, news",
      "any.required": "category is required",
    }),
  isPinned: Joi.boolean().optional().default(false),
  publishDate: Joi.date().optional(),
  expiryDate: Joi.date().optional().allow(null),
});

const updateSuperAdminNoticeValidation = Joi.object({
  title: Joi.string().optional(),
  content: Joi.string().optional(),
  fullDescription: Joi.string().optional().allow(null, ""),
  docUrl: Joi.string().uri().optional().allow(null, ""),
  audience: Joi.object({
    type: Joi.string()
      .valid("all-institutes", "specific-institutes")
      .optional()
      .messages({
        "any.only": "audience.type must be all-institutes or specific-institutes",
      }),
    instituteIds: Joi.array()
      .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
      .optional()
      .allow(null)
      .messages({
        "string.pattern.base": "Invalid institute ID format in instituteIds",
      }),
  }).optional(),
  priority: Joi.string()
    .valid("low", "medium", "high", "urgent")
    .optional()
    .messages({
      "any.only": "priority must be one of: low, medium, high, urgent",
    }),
  category: Joi.string()
    .valid("academic", "event", "announcement", "news")
    .optional()
    .messages({
      "any.only": "category must be one of: academic, event, announcement, news",
    }),
  isPinned: Joi.boolean().optional(),
  publishDate: Joi.date().optional(),
  expiryDate: Joi.date().optional().allow(null),
  status: Joi.string()
    .valid("draft", "published", "archived", "expired")
    .optional(),
});

module.exports = {
  createSuperAdminNoticeValidation,
  updateSuperAdminNoticeValidation,
};