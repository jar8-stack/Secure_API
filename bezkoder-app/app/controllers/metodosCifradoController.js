const MetodoCifrado = require('../models/MetodoCifrado');

exports.crearMetodoCifrado = async (req, res) => {
  try {
    const nuevoMetodo = await MetodoCifrado.create(req.body);
    res.json(nuevoMetodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear método de cifrado' });
  }
};

// Agrega más funciones de controlador para métodos de cifrado según tus necesidades
