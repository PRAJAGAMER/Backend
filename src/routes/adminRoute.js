const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Route untuk menampilkan semua user
router.get('/users', adminController.getAllUsers);

// Route untuk mengubah status user
router.put('/users/status', adminController.updateUserStatus);

// Route untuk menampilkan semua user
router.get('/users2', adminController.getAllUsers2);

// Route untuk mengubah status user
router.put('/users/status2', adminController.updateUserStatus2);

// Route untuk mendapatkan jumlah pendaftar secara keseluruhan
router.get('/users/count/total', adminController.getTotalApplicants);

// Route untuk mendapatkan jumlah pendaftar yang diterima (accepted)
router.get('/users/count/accepted', adminController.getAcceptedApplicants);

// Route untuk mendapatkan jumlah pendaftar yang ditolak (rejected)
router.get('/users/count/rejected', adminController.getRejectedApplicants);

module.exports = router;