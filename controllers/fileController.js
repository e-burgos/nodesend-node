const uploadFile = require('../utils/uploadFile');

exports.upload = async (req, res, next) => {

    const upload = uploadFile(req.user, 'fileName');

    upload(req, res, async (error) => {
        console.log(req.file);

        if(!error){
            res.status(200).json({ file: req.file.filename });
        } else {
            console.log(error);
        }
    })
};

exports.destroy = (req, res, next) => {
    // Si existe token enviamos el usuario
    return res.status(200).json({ user: req.user });
};
