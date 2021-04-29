const multer = require('multer');
const shortid = require('shortid');

module.exports = function uploadFile(authUser, inputName) {
    const configMulter = {
        limits: {fileSize: authUser ? (1024 * 1024 * 10) : (1024 * 1024)},
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname + '/../uploads')
            },
            filename: (req, file, cb) => {
                // Buscamos el ultimo punto de nombre del archivo y leemosla extension
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${extension}`)
            }
        })
    };
    return multer(configMulter).single(`${inputName}`);  
}