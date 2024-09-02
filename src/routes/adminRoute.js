const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminMiddleware = require('../middleware/adminMiddleware');

// Route to get all admin data
router.get('/admins', adminMiddleware, adminController.getAllAdmins);

// Route to delete admin based on admin id
router.delete('/admin/:id', adminMiddleware, adminController.deleteAdmin);

// Route to display all users
router.get('/users', adminMiddleware, adminController.getAllUsers);

// Route to change user status
router.put('/users/status',adminMiddleware,  adminController.updateUserStatus);

// Route to display all users2
router.get('/users2',adminMiddleware,  adminController.getAllUsers2);

// Route to change user status2
router.put('/users/status2',adminMiddleware,  adminController.updateUserStatus2);

// Route to display all registrant data
router.get('/admin/dashboard',adminMiddleware,  adminController.getApplicantsData);

// Route to upload banner
router.put('/banner',adminMiddleware,  adminController.updateBannerByNameBanner);

module.exports = router;