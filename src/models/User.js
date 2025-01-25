const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true }, // Nombre del usuario
  apellido: { type: String, required: true }, // Apellido del usuario
  email: { type: String, required: true, unique: true }, // Email único
  password: { type: String, required: true }, // Contraseña
  direccion: {
    calle: { type: String, required: true }, // Calle
    numero: { type: String, required: true }, // Número
    codigoPostal: { type: String, required: true }, // Código postal
  },
  subscription: [
    {
      id: { type: Number, required: true },
      nombre: { type: String, required: true },
      emoji: { type: String, required: true },
      peso: { type: Number, required: true }, // Peso en gramos
    },
  ],
});

module.exports = mongoose.model('User', UserSchema);
