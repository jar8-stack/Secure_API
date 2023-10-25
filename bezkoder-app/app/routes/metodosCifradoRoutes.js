const express = require('express');
const router = express.Router();
const metodosCifradoController = require('../controllers/metodosCifradoController');

// Rutas para métodos de cifrado
router.post('/metodos-cifrado', metodosCifradoController.crearMetodoCifrado);
router.get('/metodos-cifrado', metodosCifradoController.obtenerMetodosCifrado);
router.get('/metodos-cifrado/:id', metodosCifradoController.obtenerMetodoCifradoPorId);
router.put('/metodos-cifrado/:id', metodosCifradoController.actualizarMetodoCifrado);
router.delete('/metodos-cifrado/:id', metodosCifradoController.eliminarMetodoCifrado);

module.exports = router;
