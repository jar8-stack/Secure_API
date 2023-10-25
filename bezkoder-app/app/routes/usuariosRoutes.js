const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// Rutas para usuarios
router.post('/usuarios', usuariosController.crearUsuario);
router.get('/usuarios', usuariosController.obtenerUsuarios);
router.get('/usuarios/:id', usuariosController.obtenerUsuarioPorId);
router.put('/usuarios/:id', usuariosController.actualizarUsuario);
router.delete('/usuarios/:id', usuariosController.eliminarUsuario);

module.exports = router;
