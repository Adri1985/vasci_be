const jwt = require('jsonwebtoken');

// Middleware de autenticación
module.exports = (req, res, next) => {
  try {
    // Obtener el token del encabezado Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Agregar los datos del usuario decodificados al objeto req

    next(); // Continuar con la siguiente función del middleware o controlador
  } catch (error) {
    console.error('Error al verificar el token:', error);
    res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};
