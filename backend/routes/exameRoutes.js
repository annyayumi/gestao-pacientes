const express = require('express');
const router = express.Router();
const exameController = require('../controllers/exameController');

router.get('/exames', exameController.listarExames);

module.exports = router;