const uploadFile = require('../utils/uploadFile');
const fs = require('fs');

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

exports.destroy = (req, res, next) => {
    console.log(req.destroyFile);
    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.destroyFile}`);
        console.log('Se eliminó el archivo correctamente');
        req.destroyFile = null;
    } catch (error) {
        console.log(error);
    };
    
};
