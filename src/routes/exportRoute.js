const express = require('express');
const { exportToExcel } = require('../controllers/exportController');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Define route for exporting data to Excel
router.get('/export',adminMiddleware, exportToExcel);

module.exports = router;
