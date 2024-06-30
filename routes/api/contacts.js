const express = require('express');
const router = express.Router();
const { listContacts, getContactById, removeContact, addContact, updateContact } = require('../../models/contacts');

// Ruta para listar todos los contactos
router.get('/', async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

// Ruta para obtener un contacto por ID
router.get('/:contactId', async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId);
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
    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

// Ruta para eliminar un contacto por ID
router.delete('/:contactId', async (req, res, next) => {
  try {
    console.log(`Attempting to delete contact with ID: ${req.params.contactId}`);
    const result = await removeContact(req.params.contactId);
    if (result) {
      console.log(`Contact deleted: ${result}`);
      res.json({ message: 'Contact deleted' });
    } else {
      console.log('Contact not found');
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    console.error(`Error deleting contact: ${error}`);
    next(error);
  }
});

// Ruta para actualizar un contacto por ID
router.put('/:contactId', async (req, res, next) => {
  try {
    const updatedContact = await updateContact(req.params.contactId, req.body);
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
