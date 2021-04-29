const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const auth = require('../middleware/auth');


router.post('/', 
auth,
fileController.upload);

router.delete('/:id',
auth, 
fileController.destroy);

module.exports = router; 
