const express = require('express');
const router = express.Router();
const casoController = require('../controllers/casoController');

router.post('/register', casoController.registerCase);

module.exports = router;
