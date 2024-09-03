const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const verifyToken = require('../middlewares/verifyToken');

router.use(verifyToken);


router.get('/users', transactionController.getUsers);
router.get('/usertransactions', transactionController.getUserTransactions);

router.post('/addtransaction', transactionController.addTransaction);

module.exports = router;