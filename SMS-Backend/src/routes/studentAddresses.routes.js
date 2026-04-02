 const express = require("express");
const router = express.Router();
const addressController = require("../controllers/studentAddresses.controller");

// ============= STUDENT ADDRESSES =============
router.post("/", addressController.createAddress);
router.get("/", addressController.getAllAddresses);
router.get("/:id", addressController.getAddressById);
router.get("/student/:student_id", addressController.getAddressesByStudentId);
router.get(
  "/student/:student_id/type/:address_type",
  addressController.getAddressByType
);
router.put("/:id", addressController.updateAddress);
router.delete("/:id", addressController.deleteAddress);

module.exports = router;