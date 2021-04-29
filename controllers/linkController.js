const User = require('../models/User');
const Link = require('../models/Link');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.newLink = async (req, res) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    };
    const {original_name} = req.body;
    try {
        // Preparar objeto de enlace si el usuario no esta logueado
        const link = new Link();
        link.url = shortid.generate();
        link.name = shortid.generate();
        link.original_name = original_name;

        // En caso que el usuario se encuentre logueado
        if(req.user){
            const {password, download} = req.body;
            link.autor = req.user.id;
            link.download = download;
            // Hashear password
            const salt = await bcrypt.genSalt(10);
            link.password = await bcrypt.hash(password, salt);
        };

        // Almacenar en DB
        await link.save();
        return res.status(200).json({ msg: `${link.url}` });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Hubo un error en el servidor", errors: error });
    }
};
