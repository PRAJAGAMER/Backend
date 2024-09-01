const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Rute untuk mendapatkan semua data admin
router.get('/admins', adminController.getAllAdmins);

// Rute untuk menghapus admin berdasarkan admin_id
router.delete('/admin/:id', adminController.deleteAdmin);

// Route untuk menampilkan semua user
router.get('/users', adminController.getAllUsers);

// Route untuk mengubah status user
router.put('/users/status', adminController.updateUserStatus);

// Route untuk menampilkan semua user
router.get('/users2', adminController.getAllUsers2);

// Route untuk mengubah status user
router.put('/users/status2', adminController.updateUserStatus2);

// // Route untuk mendapatkan jumlah pendaftar secara keseluruhan
// router.get('/users/count/total', adminController.getTotalApplicants);

// // Route untuk mendapatkan jumlah pendaftar yang diterima (accepted)
// router.get('/users/count/accepted', adminController.getAcceptedApplicants);

// // Route untuk mendapatkan jumlah pendaftar yang ditolak (rejected)
// router.get('/users/count/rejected', adminController.getRejectedApplicants);

router.get('/admin/dashboard', adminController.getApplicantsData);

// Route untuk upload banner
router.put('/banner', adminController.updateBannerByNameBanner);

module.exports = router;