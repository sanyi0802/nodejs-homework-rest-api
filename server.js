const app = require('./app');
require('./db'); // Asegúrate de que la conexión se establece

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
