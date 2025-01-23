const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
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
