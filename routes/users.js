const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { check } = require('express-validator');

router.post('/', 
[
    check('name', 'El nombre es requerido').notEmpty(),
    check('email', 'El email es requerido').notEmpty(),
    check('email', 'El email debe ser un email válido').isEmail(),
    check('password', 'La contraeña es requerida').notEmpty(),
    check('password', 'La contraeña debe tener al menos 6 caracteres').isLength({min: 6}),
],
userController.create);

module.exports = router; 
