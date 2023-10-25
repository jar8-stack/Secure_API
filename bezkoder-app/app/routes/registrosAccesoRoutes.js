const express = require('express');
const router = express.Router();
const registrosAccesoController = require('../controllers/registrosAccesoController');

// Rutas para registros de acceso
router.post('/registros-acceso', registrosAccesoController.registrarAcceso);
router.get('/registros-acceso', registrosAccesoController.obtenerRegistrosAcceso);
router.get('/registros-acceso/:id', registrosAccesoController.obtenerRegistroAccesoPorId);
router.put('/registros-acceso/:id', registrosAccesoController.actualizarRegistroAcceso);
router.delete('/registros-acceso/:id', registrosAccesoController.eliminarRegistroAcceso);

module.exports = router;
