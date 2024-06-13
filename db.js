require('dotenv').config();
const mongoose = require('mongoose');

console.log('DB_HOST:', process.env.DB_HOST); 

mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Error de conexión:', error);
  process.exit(1);
});

db.once('open', () => {
  console.log('Database connection successful');
});
