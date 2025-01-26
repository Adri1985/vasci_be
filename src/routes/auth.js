// auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  const {
    nombre,
    apellido,
    email,
    password,
    calle,
    numero,
    codigoPostal,
  } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear y guardar un nuevo usuario con una suscripción vacía
    const hashedPassword = await bcrypt.hash(password, 10); // Encriptar contraseña
    const user = new User({
      nombre,
      apellido,
      email,
      password: hashedPassword,
      direccion: {
        calle,
        numero,
        codigoPostal,
      },
      subscription: [], // Inicializar la suscripción vacía
    });
    await user.save();

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)
  
    try {
      // Verificar si el usuario existe
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      // Verificar si la contraseña es válida
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }
  
      // Generar un token JWT
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
      );
  
      // Devolver el token y los datos del usuario
      res.status(200).json({
        token,
        user: {
          nombre: user.nombre,
          apellido: user.apellido,
          direccion: user.direccion,
        },
        message: 'Inicio de sesión exitoso',
      });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ message: 'Error al iniciar sesión' });
    }
  });
  // Obtener los datos del usuario
router.get('/user', async (req, res) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      res.status(200).json({ user });
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      res.status(500).json({ message: 'Error al obtener los datos del usuario' });
    }
  });
  
  

module.exports = router;
