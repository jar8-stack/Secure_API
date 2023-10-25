const express = require('express');
const router = express.Router();

const usuariosController = require('../controllers/usuariosController');
const documentosController = require('../controllers/documentosController');
const registrosAccesoController = require('../controllers/registroAccesoController');
const configuracionSeguridadController = require('../controllers/configuracionSeguridadController');
const metodosCifradoController = require('../controllers/metodosCifradoController');

// Rutas para Usuarios
router.post('/usuarios', usuariosController.crearUsuario);

// Rutas para Documentos
router.post('/documentos', documentosController.crearDocumento);

// Rutas para Registros de Acceso
router.post('/registros-acceso', registrosAccesoController.registrarAcceso);

// Rutas para Configuración de Seguridad
router.post('/configuracion-seguridad', configuracionSeguridadController.crearConfiguracionSeguridad);

// Rutas para Métodos de Cifrado
router.post('/metodos-cifrado', metodosCifradoController.crearMetodoCifrado);

module.exports = router;
