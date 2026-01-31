
const express = require('express');
const router = express.Router();
const teacherSalaryTransactionsController = require('../controllers/teacherSalaryTransactions.controller');

router.post('/transaction', teacherSalaryTransactionsController.createTransaction);
router.get('/transaction', teacherSalaryTransactionsController.getAllTransactions);
router.get('/transaction/:id', teacherSalaryTransactionsController.getTransactionById);
router.get('/transaction/teacher/:teacher_id', teacherSalaryTransactionsController.getTransactionsByTeacherId);
router.get('/transaction/month/:month', teacherSalaryTransactionsController.getTransactionsByMonth);
router.get('/transaction/status/:status', teacherSalaryTransactionsController.getTransactionsByStatus);
router.put('/transaction/:id', teacherSalaryTransactionsController.updateTransaction);
router.delete('/transaction/:id', teacherSalaryTransactionsController.deleteTransaction);

module.exports = router;























































// const express = require('express');
// const router = express.Router();
// const teacherSalaryTransactionsController = require('../controllers/teacherSalaryTransactions.controller');

// router.post('/create', teacherSalaryTransactionsController.createTransaction);
// router.get('/get-all', teacherSalaryTransactionsController.getAllTransactions);
// router.get('/get/:id', teacherSalaryTransactionsController.getTransactionById);
// router.get('/get-by-teacher/:teacherId', teacherSalaryTransactionsController.getTransactionsByTeacherId);
// router.get('/get-by-month/:month', teacherSalaryTransactionsController.getTransactionsByMonth);
// router.get('/get-by-status/:status', teacherSalaryTransactionsController.getTransactionsByStatus);
// router.put('/update/:id', teacherSalaryTransactionsController.updateTransaction);
// router.delete('/delete/:id', teacherSalaryTransactionsController.deleteTransaction);

// module.exports = router;