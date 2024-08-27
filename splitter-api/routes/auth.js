const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotpassword', authController.forgotPassword);
router.post('/verifypin', authController.verifyPin);
router.post('/resetpassword', authController.resetPassword);

module.exports = router;