const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.DB_HOST;

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexión a la base de datos exitosa');
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error);
    process.exit(1);
  }
};

connectDB();

module.exports = connectDB;
