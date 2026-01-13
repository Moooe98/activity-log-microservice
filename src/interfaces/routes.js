const express = require('express');
const router = express.Router();
const logController = require('./logController');

router.post('/logs', logController.createLog);
router.get('/logs', logController.getLogs);

module.exports = router;