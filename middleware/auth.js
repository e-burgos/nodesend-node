const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Verificar Header
    const authHeader = req.get('Authorization');

    if(authHeader){
        // Obtener token
        const token = authHeader.split(' ')[1];
        // Comprobar JWT
        try {
            if(token){
                const user = jwt.verify(token, process.env.SECRET);
                req.user = user;
            };
        } catch (error) {
            console.log(error);
            console.log("Token no válido")
        };
    }
    return next();
}