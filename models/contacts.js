const Contact = require('./contact');

const listContacts = async () => {
  return await Contact.find();
};

const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

const removeContact = async (contactId) => {
  console.log(`Removing contact with ID: ${contactId}`);
  const result = await Contact.findByIdAndDelete(contactId);
  console.log(`Remove result: ${result}`);
  return result;
};

const addContact = async (body) => {
  const newContact = new Contact(body);
  return await newContact.save();
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
