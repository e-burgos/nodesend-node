const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkController');
const fileController = require('../controllers/fileController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

router.post('/',
[
    check('name', 'Sube un archivo').notEmpty(),
    check('original_name', 'Sube un archivo').notEmpty(),
],
auth, linkController.newLink);

router.get('/:url', linkController.getLink, fileController.destroy);

module.exports = router; 
