const CoachingBatches = require("../models/coachingBatches.model");
const ClassesMaster = require("../models/classesMaster.model");
const mongoose = require("mongoose");

const CustomError = require("../exceptions/CustomError");
const statusCode = require("../enums/statusCode");      

const createBatch = async (batchData) => {
  // Verify that the class exists and is of type 'coaching'
  const classExists = await ClassesMaster.findById(batchData.class_id);
  if (!classExists) {
    throw new CustomError("Class not found", statusCode.NOT_FOUND);
  }

  if (classExists.class_type !== "coaching") {
    throw new CustomError(
      "Batches can only be created for coaching classes",
      statusCode.BAD_REQUEST
    );
  }




  const batch = new CoachingBatches({
    class_id: new mongoose.Types.ObjectId(batchData.class_id),
    batch_name: batchData.batch_name,
    start_time: batchData.start_time,
    end_time: batchData.end_time,
    capacity: batchData.capacity || null,
    status: "active",
  });

  await batch.save();
  return batch;
};

const getAllBatches = async (filters = {}) => {
  const query = {};

  if (filters.class_id) query.class_id = filters.class_id;
  if (filters.status) query.status = filters.status;

  const batches = await CoachingBatches.find(query)
    .populate("class_id", "class_name class_type academic_year")
    .sort({ createdAt: -1 });

  return batches;
};

const getBatchById = async (batchId) => {
  const batch = await CoachingBatches.findById(batchId).populate(
    "class_id",
    "class_name class_type academic_year"
  );

  if (!batch) {
    throw new CustomError("Batch not found", statusCode.NOT_FOUND);
  }

  return batch;
};

const getBatchesByClassId = async (classId) => {
  const batches = await CoachingBatches.find({ class_id: classId }).sort({
    start_time: 1,
  });

  return batches;
};

const updateBatch = async (batchId, updateData) => {
  const batch = await CoachingBatches.findById(batchId);

  if (!batch) {
    throw new CustomError("Batch not found", statusCode.NOT_FOUND);
  }

  // Handle archiving
  if (updateData.status === "archived" && batch.status !== "archived") {
    updateData.archived_at = new Date();
  }

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      batch[key] = updateData[key];
    }
  });

  await batch.save();
  return await CoachingBatches.findById(batchId).populate(
    "class_id",
    "class_name class_type academic_year"
  );
};

const deleteBatch = async (batchId) => { 
  const batch = await CoachingBatches.findById(batchId);

  if (!batch) {
    throw new CustomError("Batch not found", statusCode.NOT_FOUND);
  }

  await CoachingBatches.findByIdAndDelete(batchId);
  return batch;
};

module.exports = {
  createBatch,
  getAllBatches,
  getBatchById,
  getBatchesByClassId,
  updateBatch,
  deleteBatch,
};