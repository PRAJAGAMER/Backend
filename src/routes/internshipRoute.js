const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/internship-form', authMiddleware, internshipController.getInternshipForm);
router.post('/apply-internship', authMiddleware, internshipController.applyForInternship);

module.exports = router;