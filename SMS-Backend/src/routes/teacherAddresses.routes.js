const express = require("express");
const router = express.Router();
const teachersController = require("../controllers/teacherAddresses.controller");



// ============= ADDRESSES =============
router.post("/address", teachersController.createAddress);
router.get("/address", teachersController.getAllAddresses);          // GET ALL
router.get("/address/:id", teachersController.getAddressById);      // GET BY ID
router.get("/address/teacher/:teacher_id", teachersController.getAddressesByTeacherId);

router.put("/address/:id", teachersController.updateAddress);
router.delete("/address/:id", teachersController.deleteAddress);



module.exports = router;  