const express = require('express');
const app = express();
const apiRoutes = require('./app/routes/api'); // Importa las rutas desde api.js
const port = process.env.PORT_API || 8080;

// Middleware para analizar solicitudes JSON
app.use(express.json());

// Rutas de la API
app.use('/api', apiRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Hubo un error en el servidor.');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});
