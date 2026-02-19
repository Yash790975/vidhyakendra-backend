const mongoose = require("mongoose");

const coachingBatchesSchema = new mongoose.Schema(
  {
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassesMaster",
      required: true,
      description: "FK → classes_master._id (coaching)",
    },
    batch_name: {
      type: String,
      required: true,
      description: "Morning / Evening Batch",          
    },
    start_time: {
      type: String,
      required: true,
      description: "10:00",
    },
    end_time: {
      type: String,
      required: true,
      description: "11:00",
    },
    capacity: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive", "archived"],
      default: "active",
    },
    archived_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "coaching_batches",
  }
);

// Indexes
coachingBatchesSchema.index({ class_id: 1 });
coachingBatchesSchema.index({ status: 1 });

module.exports = mongoose.model("CoachingBatches", coachingBatchesSchema);