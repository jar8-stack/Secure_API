const Documento = require('../models/Documento');

exports.crearDocumento = async (req, res) => {
  try {
    const nuevoDocumento = await Documento.create(req.body);
    res.json(nuevoDocumento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear documento' });
  }
};

// Agrega más funciones de controlador para documentos según tus necesidades
