const Usuario = require('../models/Usuario');

exports.crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = await Usuario.create(req.body);
    res.json(nuevoUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

// Agrega más funciones de controlador para usuarios según tus necesidades
