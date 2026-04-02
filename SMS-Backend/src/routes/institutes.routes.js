const express = require('express');
const router = express.Router();
const controller = require('../controllers/institutes.controller');

router.post('/activate', controller.activateInstitute);
router.post('/', controller.createInstitute);
router.get('/', controller.getAllInstitutes);

router.get('/:id', controller.getInstituteById);
router.get('/code/:institute_code', controller.getInstituteByCode);
router.get('/type/:institute_type', controller.getInstitutesByType);
router.get('/status/:status', controller.getInstitutesByStatus);
router.put('/:id', controller.updateInstitute);
router.delete('/:id', controller.deleteInstitute); 

module.exports = router;   