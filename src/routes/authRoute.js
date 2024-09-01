const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');

// Rute untuk registrasi
router.post('/user/register', authController.registerUser);

// Rute untuk login
router.post('/user/login', authController.loginUser);

// Rute untuk registrasi admin
router.post('/admin/register', adminMiddleware, authController.registerAdmin);

// Rute untuk login admin
router.post('/admin/login', authController.loginAdmin);

module.exports = router;