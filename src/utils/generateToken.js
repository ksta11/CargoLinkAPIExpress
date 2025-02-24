const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const generateToken = (userId, role) => {
    return jwt.sign({userId, role}, process.env.JWT_SECRET, {
        expiresIn: '1h', // El token expira en 1 hora
    })
}

module.exports = generateToken;