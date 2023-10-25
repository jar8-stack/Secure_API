const ConfiguracionSeguridad = require('../models/ConfiguracionSeguridad');

exports.crearConfiguracionSeguridad = async (req, res) => {
  try {
    const nuevaConfiguracion = await ConfiguracionSeguridad.create(req.body);
    res.json(nuevaConfiguracion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear configuración de seguridad' });
  }
};

// Agrega más funciones de controlador para configuración de seguridad según tus necesidades
