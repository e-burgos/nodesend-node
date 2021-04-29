const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.create = async (req, res) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }
    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({ msg: "Este correo ya esta registrado" })
        };

        // Crear usuario
        user = new User(req.body);

        // Hashear el pass
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Guardar usuario
        await user.save();
        res.status(200).json({ msg: "Usuario registrado correctamente" })

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Hubo un error en el servidor" })
    }
};
