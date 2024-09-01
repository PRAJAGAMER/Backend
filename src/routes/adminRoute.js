const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminMiddleware = require('../middleware/adminMiddleware');

// Rute untuk mendapatkan semua data admin
router.get('/admins', adminMiddleware, adminController.getAllAdmins);

// Rute untuk menghapus admin berdasarkan admin_id
router.delete('/admin/:id', adminMiddleware, adminController.deleteAdmin);

// Route untuk menampilkan semua user
router.get('/users', adminMiddleware, adminController.getAllUsers);

// Route untuk mengubah status user
router.put('/users/status',adminMiddleware,  adminController.updateUserStatus);

// Route untuk menampilkan semua user
router.get('/users2',adminMiddleware,  adminController.getAllUsers2);

// Route untuk mengubah status user
router.put('/users/status2',adminMiddleware,  adminController.updateUserStatus2);

// // Route untuk mendapatkan jumlah pendaftar secara keseluruhan
// router.get('/users/count/total', adminController.getTotalApplicants);

// // Route untuk mendapatkan jumlah pendaftar yang diterima (accepted)
// router.get('/users/count/accepted', adminController.getAcceptedApplicants);

// // Route untuk mendapatkan jumlah pendaftar yang ditolak (rejected)
// router.get('/users/count/rejected', adminController.getRejectedApplicants);

router.get('/admin/dashboard',adminMiddleware,  adminController.getApplicantsData);

// Route untuk upload banner
router.put('/banner',adminMiddleware,  adminController.updateBannerByNameBanner);

module.exports = router;