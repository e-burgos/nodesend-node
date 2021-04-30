const Link = require('../models/Link');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.newLink = async (req, res, next) => {
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
        res.status(200).json({ msg: `${link.url}` });

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
        res.status(200).json({ file: link.name });
        
        // Si download = 1 => Borrar enlace y archivo
        const { download, name } = link;
        if(download == 1){
            // Eliminar el archivo
            req.destroyFile = name;

            // Eliminar el enlace
            await Link.findOneAndRemove({ url });
            
            // Continuamos al siguiente middleware para eliminar el archivo
            next();

        } else {
            // Dismininuimos cantidad de descargas
            link.download--;
            await link.save();
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Hubo un error en el servidor" });
    }
};