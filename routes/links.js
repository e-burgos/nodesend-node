const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

router.post('/',
[
    check('name', 'Sube un archivo').notEmpty(),
    check('original_name', 'Sube un archivo').notEmpty(),
],
auth, linkController.newLink);

router.get('/', 
linkController.allLinks);

router.get('/:url', 
linkController.checkPassword,
linkController.getLink);

router.post('/:url', 
linkController.verifyPassword,
linkController.getLink);

router.get('/user/:userId', 
linkController.filterLinks);

module.exports = router; 
