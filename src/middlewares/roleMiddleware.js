const roleMiddleware = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Acceso denegado. No tienes permisos suficientes.' });
      }
      next();
    };
  };
  
export default roleMiddleware;