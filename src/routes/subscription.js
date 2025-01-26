const express = require('express');
const User = require('../models/User'); // Modelo del Usuario
const authMiddleware = require('../middlewares/auth'); // Middleware para autenticar al usuario
const router = express.Router();

// Obtener la suscripción del usuario logueado
router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log('Usuario autenticado:', req.user);  // Imprimir el usuario desde el token
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ subscription: user.subscription });
  } catch (error) {
    console.error('Error al obtener la suscripción:', error);
    res.status(500).json({ message: 'Error al obtener la suscripción' });
  }
});

// Inicializar la suscripción del usuario
router.post('/init', authMiddleware, async (req, res) => {
  try {
    console.log('Usuario autenticado:', req.user); // Log del usuario autenticado

    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('Usuario no encontrado en la base de datos.');
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Log de la suscripción actual
    console.log('Suscripción actual del usuario:', user.subscription);

    // Inicializar la suscripción si no existe o está vacía
    if (!user.subscription || user.subscription.length === 0) {
      console.log('Inicializando suscripción vacía para el usuario...');
      user.subscription = [];
      await user.save();
      console.log('Suscripción inicializada con éxito.');
    }

    res.status(200).json({ message: 'Suscripción inicializada', subscription: user.subscription });
  } catch (error) {
    console.error('Error al inicializar la suscripción:', error);
    res.status(500).json({ message: 'Error al inicializar la suscripción' });
  }
});

// Agregar un producto a la suscripción
router.post('/add', authMiddleware, async (req, res) => {
  const { id, nombre, emoji, peso } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el producto ya está en la suscripción
    const existingProduct = user.subscription.find((item) => item.id === id);
    if (existingProduct) {
      return res.status(400).json({ message: 'El producto ya está en la suscripción' });
    }

    // Agregar el producto a la suscripción
    user.subscription.push({ id, nombre, emoji, peso });
    await user.save();

    res.status(200).json({ message: 'Producto agregado a la suscripción', subscription: user.subscription });
  } catch (error) {
    console.error('Error al agregar el producto:', error);
    res.status(500).json({ message: 'Error al agregar el producto' });
  }
});

// Eliminar un producto de la suscripción
router.post('/remove', authMiddleware, async (req, res) => {
  const { id } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Filtrar el producto para eliminarlo
    user.subscription = user.subscription.filter((item) => item.id !== id);
    await user.save();

    res.status(200).json({ message: 'Producto eliminado de la suscripción', subscription: user.subscription });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ message: 'Error al eliminar el producto de la suscripción' });
  }
});

module.exports = router;
