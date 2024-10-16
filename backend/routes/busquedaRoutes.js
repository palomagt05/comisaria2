const express = require('express');
const router = express.Router();
const { searchDelincuentes } = require('../controllers/busquedaController');

// Ruta para buscar delincuentes
router.get('/search', searchDelincuentes);

module.exports = router;
