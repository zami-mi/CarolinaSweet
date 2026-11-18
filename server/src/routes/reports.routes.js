const { Router } = require('express');
const { getReports } = require('../controllers/reports.controller');

const router = Router();

// GET /api/reports?period=day|week|month|year
router.get('/', getReports);

module.exports = router;
