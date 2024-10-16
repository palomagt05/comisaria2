const express = require('express');
const router = express.Router();
const { insertarJefe } = require('../controllers/jefesController');

router.post('/jefes', insertarJefe);

module.exports = router;
