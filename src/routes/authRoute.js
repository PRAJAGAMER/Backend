const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');

// Route to registration
router.post('/user/register', authController.registerUser);

// Route to login
router.post('/user/login', authController.loginUser);

// Route to admin registration
router.post('/admin/register', adminMiddleware, authController.registerAdmin);

// Route to admin login 
router.post('/admin/login', authController.loginAdmin);

module.exports = router;