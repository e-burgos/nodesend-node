const Link = require('../models/Link');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.newLink = async (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    };
    const {original_name, name} = req.body;
    try {
        // Preparar objeto de enlace si el usuario no esta logueado
        const link = new Link();
        link.url = shortid.generate();
        link.name = name;
        link.original_name = original_name;

        // En caso que el usuario se encuentre logueado
        if(req.user){
            const {password, download} = req.body;
            link.autor = req.user.id;
            link.download = download;
            if(password !== ""){
                // Hashear password
                const salt = await bcrypt.genSalt(10);
                link.password = await bcrypt.hash(password, salt);
            }
        };
        // Almacenar en DB
        await link.save();
        res.status(200).json({ url: `${link.url}` });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Hubo un error en el servidor" });
    }
};

// Obtener listado de todos los enlaces
exports.allLinks = async (req, res, next) => {
    try {
        const links = await Link.find({}).select('url -_id');
        res.status(200).json({ links });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Hubo un error en el servidor" });
    }
};

// Obtener listado enlaces por usuario
exports.filterLinks = async (req, res, next) => {
    const { userId } = req.params; 
    try {
        const links = await Link.find({ autor: userId }).select('-_id -__v');
        if(links.length > 0){
            res.status(200).json({ links });
        } else {
            return res.status(404).json({ msg: "No se encontro ningún enlace publicado hasta el momento" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Hubo un error en el servidor" });
    }
};

// Verificar password
exports.checkPassword = async (req, res, next) => {
    const { url } = req.params;
    try {
        // Verificar enlace
        const link = await Link.findOne({ url });

        // si no exite el enlace 
        if(!link){
            res.status(404).json({ msg: "No se encontró el enlace de descarga" });
            return next();
        };

        if(link.password){
            // Password encontrado 
            return res.status(200).json({ password: true, url: link.url, download: link.download, file: link.name });
        }
        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Hubo un error en el servidor" });
    }
}

exports.verifyPassword = async (req, res, next) => {
    const { password } = req.body;
    const { url } = req.params;
    try {
        // Verificar enlace
        const link = await Link.findOne({ url });

        // si no exite el enlace 
        if(!link){
            res.status(404).json({ msg: "No se encontró el enlace de descarga" });
            return next();
        };

        if(bcrypt.compareSync(password, link.password)){
            // Permitir descargar el archivo  
            next();
        } else {
            return res.status(401).json({ msg: "Password Incorrecta" });
        };

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Hubo un error en el servidor" });
    }
};

exports.getLink = async (req, res, next) => {
    const { url } = req.params;
    try {
        // Verificar enlace
        const link = await Link.findOne({ url });

        // si no exite el enlace 
        if(!link){
            res.status(404).json({ msg: "No se encontró el enlace de descarga" });
            return next();
        };

        // Enlace encontrado 
        return res.status(200).json({ file: link.name, download: link.download, url: link.url });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Hubo un error en el servidor" });
    }
};
