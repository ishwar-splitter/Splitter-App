const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/transactionController');


router.get('/users', expenseController.getUsers);
router.get('/usertransactions/:userId', expenseController.getUserTransactions);

module.exports = router;