const express = require('express');
const router = express.Router();
const Contact = require('../../models/contact');
const auth = require('../../middlewares/auth');

// Añadir el middleware de autenticación a todas las rutas
router.use(auth);

// Ruta para listar todos los contactos del usuario autenticado
router.get('/', async (req, res, next) => {
  try {
    console.log('List contacts for user:', req.user._id);
    const contacts = await Contact.find({ owner: req.user._id });
    console.log('Contacts found:', contacts);
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    next(error);
  }
});

// Ruta para obtener un contacto por ID
router.get('/:contactId', async (req, res, next) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.contactId, owner: req.user._id });
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    next(error);
  }
});

// Ruta para agregar un nuevo contacto
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, favorite } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const newContact = new Contact({ name, email, phone, favorite, owner: req.user._id });
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
});


// Ruta para eliminar un contacto por ID
router.delete('/:contactId', async (req, res, next) => {
  try {
    const result = await Contact.findOneAndDelete({ _id: req.params.contactId, owner: req.user._id });
    if (result) {
      res.json({ message: 'Contact deleted' });
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    next(error);
  }
});

// Ruta para actualizar un contacto por ID
router.put('/:contactId', async (req, res, next) => {
  try {
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: req.params.contactId, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (updatedContact) {
      res.json(updatedContact);
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    next(error);
  }
});

// Ruta para actualizar el estado de favorito de un contacto
router.patch('/:contactId/favorite', async (req, res, next) => {
  try {
    const { favorite } = req.body;
    if (favorite === undefined) {
      return res.status(400).json({ message: 'missing field favorite' });
    }

    const updatedContact = await Contact.findOneAndUpdate(
      { _id: req.params.contactId, owner: req.user._id },
      { favorite },
      { new: true }
    );

    if (updatedContact) {
      res.json(updatedContact);
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
