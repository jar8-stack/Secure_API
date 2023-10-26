const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// Ruta para el registro de usuarios
router.post('/registro', usuariosController.registrarUsuario);

// Ruta para la autenticación de Google
router.get('/auth/google', usuariosController.registrarUsuarioConGoogle);

// Ruta de redirección después de la autenticación de Google
router.get('/auth/google/callback', usuariosController.registrarUsuarioConGoogle);


module.exports = router;
