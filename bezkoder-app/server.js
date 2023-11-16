const express = require('express');
const session = require('express-session');
const passportConfig = require('./app/config/passport-config');
const googleAuthRoutes = require('./app/routes/googleRoutes');
const apiRoutes = require('./app/routes/api');

const app = express();

// Ajustar el límite de tamaño de solicitud
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const port = process.env.PORT_API || 8080;

// Configuración de express-session
app.use(
  session({
    secret: 'tu_secreto', // Cambia esto por una cadena de secreto segura
    resave: true,
    saveUninitialized: true,
  })
);

// Configuración Passport
passportConfig(app);

// Rutas de autenticación de Google
app.use(googleAuthRoutes);

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
