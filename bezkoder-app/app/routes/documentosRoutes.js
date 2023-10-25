const express = require('express');
const router = express.Router();
const documentosController = require('../controllers/documentosController');

// Rutas para documentos
router.post('/documentos', documentosController.crearDocumento);
router.get('/documentos', documentosController.obtenerDocumentos);
router.get('/documentos/:id', documentosController.obtenerDocumentoPorId);
router.put('/documentos/:id', documentosController.actualizarDocumento);
router.delete('/documentos/:id', documentosController.eliminarDocumento);

module.exports = router;
