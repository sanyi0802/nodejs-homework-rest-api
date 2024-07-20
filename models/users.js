const User = require('./user');
const { nanoid } = require('nanoid');
const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.SENDGRID_API_KEY,
  })
);

const listUsers = async () => {
  return await User.find();
};

const getUserById = async (userId) => {
  return await User.findById(userId);
};

const removeUser = async (userId) => {
  return await User.findByIdAndDelete(userId);
};

const addUser = async (body) => {
  const verificationToken = nanoid();
  const newUser = new User({ ...body, verificationToken });
  await newUser.save();

  const verificationUrl = `http://localhost:${process.env.PORT}/api/users/verify/${verificationToken}`;

  await transport.sendMail({
    from: 'your-email@example.com',
    to: newUser.email,
    subject: 'Verifica tu correo electrónico',
    html: `<p>Por favor verifica tu correo electrónico haciendo clic en el siguiente enlace: <a href="${verificationUrl}">${verificationUrl}</a></p>`,
  });

  return newUser;
};

const verifyUser = async (verificationToken) => {
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  user.verify = true;
  user.verificationToken = null;
  await user.save();
  return user;
};

module.exports = {
  listUsers,
  getUserById,
  removeUser,
  addUser,
  verifyUser,
};
