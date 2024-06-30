const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = process.env;

const auth = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7, authorization.length) : null;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);

    if (!user || user.token !== token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
  }
};

module.exports = auth;
