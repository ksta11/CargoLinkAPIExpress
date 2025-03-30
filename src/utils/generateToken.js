import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const generateToken = (id, role, email, name, lastname) => {
    return jwt.sign({id, role, email, name, lastname}, process.env.JWT_SECRET, {
        expiresIn: '1h', // El token expira en 1 hora
    })
}

export default generateToken;