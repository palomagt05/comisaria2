const express = require('express');
const router = express.Router();
const addPoliController = require('../controllers/poliController');

// ... otras rutas

// Ruta para agregar usuarios
router.post('/poli/add', addPoliController.addPoli);
router.get('/policias',addPoliController.getPolis)

module.exports = router;
