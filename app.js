const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const usersRouter = require('./routes/api/users');
require('./db'); 

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'No encontrado' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
