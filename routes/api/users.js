const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const auth = require('../../middlewares/auth');
const { JWT_SECRET } = process.env;
const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');

// Configuración de multer para la carga de archivos
const tempDir = path.join(__dirname, '../../tmp');
const upload = multer({
  dest: tempDir,
  limits: {
    fileSize: 1024 * 1024, // Limitar el tamaño del archivo a 1MB
  },
});

// Registro de usuario
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email in use' });
    }

    const avatarURL = gravatar.url(email, { s: '250', r: 'pg', d: 'mm' });
    const newUser = new User({ email, password, avatarURL });
    await newUser.save();

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Email or password is wrong' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    user.token = token;
    await user.save();

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Logout de usuario
router.get('/logout', auth, async (req, res) => {
  try {
    req.user.token = null;
    await req.user.save();
    res.status(204).send();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
  }
});

// Obtener usuario actual
router.get('/current', auth, async (req, res) => {
  try {
    res.json({
      email: req.user.email,
      subscription: req.user.subscription,
      avatarURL: req.user.avatarURL,
    });
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
  }
});

// Endpoint para actualizar el avatar
router.patch('/avatars', auth, upload.single('avatar'), async (req, res, next) => {
  try {
    const { path: tempUpload, originalname } = req.file;
    const { _id: id } = req.user;
    const filename = `${id}_${originalname}`;
    const resultUpload = path.join(__dirname, '../../public/avatars', filename);

    await fs.rename(tempUpload, resultUpload);
    const avatarURL = `/public/avatars/${filename}`;
    
    // Procesar la imagen con Jimp
    const image = await Jimp.read(resultUpload);
    image.resize(250, 250);
    await image.writeAsync(resultUpload);

    await User.findByIdAndUpdate(req.user._id, { avatarURL });

    res.json({ avatarURL });
  } catch (error) {
    await fs.unlink(req.file.path);
    next(error);
  }
});

module.exports = router;
