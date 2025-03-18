import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // Obtener el token del header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Agregar el usuario decodificado a la solicitud
    next();
  } catch (err) {
    res.status(400).json({ message: 'Token inválido' });
  }
};

export default authMiddleware;