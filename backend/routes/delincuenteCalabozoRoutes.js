const express = require('express');
const router = express.Router();
const assignDelincuenteToCalabozo= require('../controllers/delincuenteCalabozoController');

router.post('/assign', assignDelincuenteToCalabozo.assignDelincuenteToCalabozo);

module.exports = router;
