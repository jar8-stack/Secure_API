const Documento = require('../models/Documento');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const multer = require('multer');

// Configuración de Multer para guardar archivos en una carpeta temporal
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.crearDocumento = async (req, res) => {
  try {
    const nuevoDocumento = await Documento.create(req.body);
    res.json(nuevoDocumento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear documento' });
  }
};

// Obtener todos los documentos
exports.obtenerDocumentos = async (req, res) => {
  try {
    // Obtén el token JWT del encabezado de la solicitud
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ mensaje: 'No se proporcionó un token JWT' });
    }    
    
    try {      

      // Verifica y decodifica el token JWT
    const decoded = jwt.verify(token, 'secreto'); // Reemplaza 'secreto' con tu clave secreta JWT      
    console.log(decoded)

    // Ahora, puedes usar "decoded" para obtener información del usuario, como su ID o correo electrónico
    const PropietarioID = decoded.id; // Asume que el token JWT contiene el ID del usuario+

      // Recupera los documentos del usuario con el ID obtenido del JWT
      const documentos = await Documento.findAll({ where: { PropietarioID: PropietarioID } });      

      if (documentos.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron documentos para este usuario' });
      }

      res.json(documentos);
    } catch (error) {
      return res.status(401).json({ mensaje: 'Token JWT no válido' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener documentos del usuario' });
  }
};


// Controlador para encriptar y guardar un documento
exports.encriptarDocumento = async (req, res) => {
  try {
    const { documento, claveDeEncriptacion, PropietarioID, FechaCarga } = req.body;

    if (!documento || !claveDeEncriptacion) {
      return res.status(400).json({ mensaje: 'No se proporcionó un archivo o una clave de encriptación' });
    }

    // Encripta el archivo utilizando la clave proporcionada
    const encryptedData = crypto.createHmac('sha256', claveDeEncriptacion).update(documento).digest('hex');

    // Guarda el archivo en la base de datos
    const nuevoDocumento = await Documento.create({
      NombreDocumento: 'nombre_archivo', // Puedes proporcionar un nombre si es relevante
      TipoDocumento: 'application/pdf', // Puedes proporcionar un tipo MIME adecuado
      DatosDocumento: encryptedData,
      FechaCarga: FechaCarga || new Date(), // Puedes usar la fecha proporcionada o la fecha actual
      PropietarioID: PropietarioID || 0, // Puedes usar el PropietarioID proporcionado o un valor predeterminado
    });

    res.json(nuevoDocumento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al encriptar y guardar el documento' });
  }
};

// Controlador para desencriptar un documento
exports.desencriptarDocumento = async (req, res) => {
  try {
    const { documentoId, claveDeEncriptacion } = req.body;

    if (!documentoId || !claveDeEncriptacion) {
      return res.status(400).json({ mensaje: 'No se proporcionó un ID de documento o una clave de desencriptación' });
    }

    // Obtén el documento encriptado de la base de datos por su ID
    const documentoEncriptado = await Documento.findByPk(documentoId);

    if (!documentoEncriptado) {
      return res.status(404).json({ mensaje: 'Documento encriptado no encontrado' });
    }

    // Desencripta el archivo utilizando la misma clave utilizada para la encriptación
    const decryptedData = crypto.createHmac('sha256', claveDeEncriptacion).update(documentoEncriptado.DatosDocumento).digest('hex');

    // Puedes hacer lo que desees con los datos desencriptados, como guardarlos en un archivo o enviarlos como respuesta
    res.json({ datosDesencriptados: decryptedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al desencriptar el documento' });
  }
};
