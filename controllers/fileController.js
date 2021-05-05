const uploadFile = require('../utils/uploadFile');
const fs = require('fs');
const Link = require('../models/Link');

// Subir un achivo
exports.upload = async (req, res, next) => {
    const upload = uploadFile(req.user, 'fileToUpload');
    upload(req, res, async (error) => {
        console.log([req.user, req.file]);

        if(!error){
            res.status(200).json({ file: req.file.filename });
        } else {
            console.log(error);
        }
    })
};


// Borrar un achivo
exports.destroy = (req, res, next) => {
    console.log(req.destroyFile);
    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.destroyFile}`);
        console.log('Se eliminó el archivo correctamente');
        req.destroyFile = null;
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Hubo un error en el servidor" });
    };
    
};

// Descargar un achivo
exports.download = async (req, res, next) => {
    
    const file = __dirname + '/../uploads/' + req.params.file;
    res.download(file);
    
    try {
        // Verificar enlace
        const link = await Link.findOne({ name: req.params.file });

        // Si download = 1 => Borrar enlace y archivo
        const { download, name } = link;

        if(download == 1){
            // Eliminar el archivo
            req.destroyFile = name;

            // Eliminar el enlace
            await Link.findOneAndRemove({_id: link.id});
            
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
}
