const express = require('express');
const router = express.Router();
const controller = require('../controllers/instituteBasicInfo.controller');

router.post('/', controller.createInstituteBasicInfo);  
router.get('/', controller.getAllInstituteBasicInfo);
router.get('/:id', controller.getInstituteBasicInfoById);
router.get('/institute/:institute_id', controller.getInstituteBasicInfoByInstituteId);
router.get('/verified/list', controller.getVerifiedInstituteBasicInfo);
router.put('/:id', controller.updateInstituteBasicInfo);
router.delete('/:id', controller.deleteInstituteBasicInfo); 
 
module.exports = router;          