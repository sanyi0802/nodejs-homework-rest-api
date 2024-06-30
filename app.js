const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');

const contactsRouter = require('./routes/api/contacts');
const usersRouter = require('./routes/api/users');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/api/contacts', contactsRouter);
app.use('/api/users', usersRouter);

const { DB_HOST, PORT = 3001 } = process.env;

mongoose.connect(DB_HOST)
  .then(() => {
    console.log('Database connection successful');
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch(error => {
    console.error(`Server not running. Error message: ${error.message}`);
    process.exit(1);
  });

module.exports = app;
