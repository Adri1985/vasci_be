const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  console.log("Token recibido:", token); // Imprimir el token recibido en la solicitud

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      console.log('Error al verificar el token:', err);
      return res.status(403).json({ message: 'Token no válido' });
    }
    console.log("Usuario autenticado:", user);  // Imprimir el usuario autenticado desde el token
    req.user = user;
    next();
  });
};
