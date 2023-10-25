const RegistroAcceso = require('../models/RegistroAcceso');

exports.registrarAcceso = async (req, res) => {
  try {
    const nuevoRegistro = await RegistroAcceso.create(req.body);
    res.json(nuevoRegistro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar acceso' });
  }
};

// Agrega más funciones de controlador para registros de acceso según tus necesidades
