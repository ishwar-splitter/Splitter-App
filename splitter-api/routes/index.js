const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const transactionRoutes = require('./transactions');
const { pool } = require('../config/db');

router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);


router.get('/health', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      connection.release();
      res.json({ status: 'OK', message: 'Database connection successful' });
    } catch (error) {
      res.status(500).json({ status: 'Error', message: 'Database connection failed' });
    }
});

module.exports = router;