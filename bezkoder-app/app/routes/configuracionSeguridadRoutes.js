const express = require('express');
const router = express.Router();
const configuracionSeguridadController = require('../controllers/configuracionSeguridadController');

// Rutas para configuración de seguridad
router.post('/configuracion-seguridad', configuracionSeguridadController.crearConfiguracionSeguridad);
router.get('/configuracion-seguridad', configuracionSeguridadController.obtenerConfiguracionesSeguridad);
router.get('/configuracion-seguridad/:id', configuracionSeguridadController.obtenerConfiguracionSeguridadPorId);
router.put('/configuracion-seguridad/:id', configuracionSeguridadController.actualizarConfiguracionSeguridad);
router.delete('/configuracion-seguridad/:id', configuracionSeguridadController.eliminarConfiguracionSeguridad);

module.exports = router;
