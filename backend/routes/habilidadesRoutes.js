// routes/hanilidadesRoutes.js
const express = require('express');
const router = express.Router();
const habilidadesController = require('../controllers/habilidadesController');

// Ruta para insertar habilidades
router.post('/habilidad', habilidadesController.insertarHabilidad);

module.exports = router;
