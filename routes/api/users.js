const express = require('express');
const router = express.Router();
const { listUsers, getUserById, removeUser, addUser, verifyUser } = require('../../models/users');


router.get('/', async (req, res, next) => {
  try {
    const users = await listUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});


router.get('/:userId', async (req, res, next) => {
  try {
    const user = await getUserById(req.params.userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    next(error);
  }
});


router.post('/', async (req, res, next) => {
  try {
    const newUser = await addUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});


router.delete('/:userId', async (req, res, next) => {
  try {
    const result = await removeUser(req.params.userId);
    if (result) {
      res.json({ message: 'Usuario eliminado' });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    next(error);
  }
});


router.get('/verify/:verificationToken', async (req, res, next) => {
  try {
    await verifyUser(req.params.verificationToken);
    res.json({ message: 'Verificación exitosa' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
