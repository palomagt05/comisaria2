const express = require('express');
const router = express.Router();
const { insertarInvestigacion } = require('../controllers/investigacionController');

router.post('/investigacion', insertarInvestigacion);

module.exports = router;
