const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
  },
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio'],
    unique: true,
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, 'El token de verificación es obligatorio'],
  },
});

const User = model('User', userSchema);

module.exports = User;
