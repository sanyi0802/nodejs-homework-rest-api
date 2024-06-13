const express = require('express');
const router = express.Router();
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact
} = require('../../models/contacts');
const Joi = require('joi');
const auth = require('../../middleware/auth');

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean()
});

router.get('/', auth, async (req, res, next) => {
  try {
    const contacts = await listContacts(req.user._id);
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', auth, async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId, req.user._id);
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    next(error);
  }
});

router.post('/', auth, async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const newContact = await addContact(req.body, req.user._id);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', auth, async (req, res, next) => {
  try {
    const result = await removeContact(req.params.contactId, req.user._id);
    if (result) {
      res.json({ message: 'contact deleted' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', auth, async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const updatedContact = await updateContact(req.params.contactId, req.body, req.user._id);
    if (updatedContact) {
      res.json(updatedContact);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    next(error);
  }
});

router.patch('/:contactId/favorite', auth, async (req, res, next) => {
  try {
    const { favorite } = req.body;
    if (favorite === undefined) {
      return res.status(400).json({ message: 'missing field favorite' });
    }
    const updatedContact = await updateContact(req.params.contactId, { favorite }, req.user._id);
    if (updatedContact) {
      res.json(updatedContact);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
