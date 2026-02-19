const express = require("express");
const router = express.Router();
const batchesController = require("../controllers/coachingBatches.controller");

// ============= COACHING BATCHES =============
router.post("/", batchesController.createBatch);
router.get("/", batchesController.getAllBatches);
router.get("/:id", batchesController.getBatchById);
router.get("/class/:class_id", batchesController.getBatchesByClassId);
router.put("/:id", batchesController.updateBatch);
router.delete("/:id", batchesController.deleteBatch);

module.exports = router;