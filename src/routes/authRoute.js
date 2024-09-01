const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const { authenticateToken, isSuperAdmin } = require('../middleware/authMiddleware');

// Rute untuk registrasi
router.post('/user/register', authController.registerUser);

// Rute untuk login
router.post('/user/login', authController.loginUser);

// Rute untuk registrasi admin
router.post('/admin/register', authController.registerAdmin);

// Rute untuk login admin
router.post('/admin/login', authController.loginAdmin);

module.exports = router;