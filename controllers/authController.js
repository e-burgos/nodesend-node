const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');


exports.authenticateUser = async (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const {email, password} = req.body;
    try {
        // Traer usuario
        let user = await User.findOne({email});

        // verificar usuario
        if(!user){
            return res.status(401).json({ msg: "Usuario no registrado" });
        };

        // Verificar password
        if(!bcrypt.compareSync(password, user.password)){
            return res.status(401).json({ msg: "Password incorrecta" });
        } else {
            // crear firma con JWT
            const token = jwt.sign({
                id: user._id,
                name: user.name,
                email: user.email
            }, process.env.SECRET, {
                expiresIn: '8h'
            });
            return res.status(200).json({ token });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Hubo un error en el servidor", errors: error });
    }
};

exports.authenticatedUser = (req, res, next) => {
    // Si existe token enviamos el usuario
    return res.status(200).json({ user: req.user });
};
