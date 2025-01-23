const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Modelo de usuario
const authMiddleware = require('../middlewares/auth'); // Middleware para autenticar al usuario

// Endpoint: Obtener la suscripción del usuario logueado
router.get('/subscription', authMiddleware, async (req, res) => {
  try {
    // Buscar al usuario logueado por su ID (obtenido del token JWT)
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Devolver la suscripción (array de verduras con peso)
    res.json({ subscription: user.subscription });
  } catch (error) {
    console.error('Error al obtener la suscripción:', error);
    res.status(500).json({ message: 'Error al obtener la suscripción' });
  }
});

module.exports = router;
