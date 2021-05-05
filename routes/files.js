const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const auth = require('../middleware/auth');

// Subir archivo
router.post('/', 
auth,
fileController.upload);

// Descargar y eliminar archivo
router.get('/:file', 
fileController.download, 
fileController.destroy);

module.exports = router; 
