/**
 * Formats a JS Date object into Indian format:
 * Date  → "15/03/2026"
 * Time  → "11:45:30 AM"
 * DateTime → "15/03/2026, 11:45:30 AM"
 */

const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
};

const formatTime = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
};

const formatDateTime = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
};

/**
 * Converts Mongoose Decimal128 / any numeric value to a plain JS number.
 * Prevents {"$numberDecimal": "10"} appearing in responses.
 */
const toNumber = (value) => {
  if (value === null || value === undefined) return null;
  const parsed = parseFloat(value.toString());
  return isNaN(parsed) ? null : parsed;
};

/**
 * Formats a plain Mongoose document (after .toObject() or .toJSON())
 * and converts all known date fields to Indian format,
 * and all Decimal128 fields to plain numbers.
 */
const formatAssessmentDates = (obj) => {
  if (!obj) return obj;
  if (obj.available_from !== undefined) obj.available_from = formatDateTime(obj.available_from);
  if (obj.available_until !== undefined) obj.available_until = formatDateTime(obj.available_until);
  if (obj.createdAt !== undefined) obj.createdAt = formatDateTime(obj.createdAt);
  if (obj.updatedAt !== undefined) obj.updatedAt = formatDateTime(obj.updatedAt);
  return obj;
};

const formatAttemptFields = (obj) => {
  if (!obj) return obj;
  if (obj.started_at !== undefined) obj.started_at = formatDateTime(obj.started_at);
  if (obj.submitted_at !== undefined) obj.submitted_at = formatDateTime(obj.submitted_at);
  if (obj.evaluated_at !== undefined) obj.evaluated_at = formatDateTime(obj.evaluated_at);
  if (obj.createdAt !== undefined) obj.createdAt = formatDateTime(obj.createdAt);
  if (obj.updatedAt !== undefined) obj.updatedAt = formatDateTime(obj.updatedAt);
  // Convert Decimal128 fields
  if (obj.marks_obtained !== undefined) obj.marks_obtained = toNumber(obj.marks_obtained);
  if (obj.percentage !== undefined) obj.percentage = toNumber(obj.percentage);
  return obj;
};

const formatAnswerFields = (obj) => {
  if (!obj) return obj;
  if (obj.createdAt !== undefined) obj.createdAt = formatDateTime(obj.createdAt);
  if (obj.updatedAt !== undefined) obj.updatedAt = formatDateTime(obj.updatedAt);
  // Convert Decimal128 fields
  if (obj.marks_awarded !== undefined) obj.marks_awarded = toNumber(obj.marks_awarded);
  if (obj.teacher_marks !== undefined) obj.teacher_marks = toNumber(obj.teacher_marks);
  return obj;
};

const formatQuestionDates = (obj) => {
  if (!obj) return obj;
  if (obj.createdAt !== undefined) obj.createdAt = formatDateTime(obj.createdAt);
  if (obj.updatedAt !== undefined) obj.updatedAt = formatDateTime(obj.updatedAt);
  return obj;
};

module.exports = {
  formatDate,
  formatTime,
  formatDateTime,
  toNumber,
  formatAssessmentDates,
  formatAttemptFields,
  formatAnswerFields,
  formatQuestionDates,
};