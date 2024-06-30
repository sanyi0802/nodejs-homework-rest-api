const multer = require('multer');
const path = require('path');

const tempDir = path.join(__dirname, '../tmp');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 // Limitar el tamaño del archivo a 1MB
  },
});

module.exports = upload;
