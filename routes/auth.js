const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

router.post('/', 
[
    check('email', 'El email es requerido').notEmpty(),
    check('email', 'El email debe ser un email válido').isEmail(),
    check('password', 'La contraseña es requerida').notEmpty(),
],
authController.authenticateUser);

router.get('/',
auth, 
authController.authenticatedUser);

module.exports = router; 
