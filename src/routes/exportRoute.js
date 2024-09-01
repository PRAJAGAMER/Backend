// routes/exportRoute.js
const express = require('express');
const { exportToExcel } = require('../controllers/exportController');

const router = express.Router();

// Define route for exporting data to Excel
router.get('/export', exportToExcel);

module.exports = router;
