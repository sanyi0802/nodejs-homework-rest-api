const Contact = require('./contact_temp'); // Asegúrate de que la ruta es correcta y está en minúsculas

const listContacts = async () => {
  return await Contact.find({});
};

const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

const removeContact = async (contactId) => {
  return await Contact.findByIdAndRemove(contactId);
};

const addContact = async (body) => {
  return await Contact.create(body);
};

const updateContact = async (contactId, body) => {
  return await Contact.findByIdAndUpdate(contactId, body, { new: true });
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
