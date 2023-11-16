const Documento = require('../models/Documento');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const multer = require('multer');

// Configuración de Multer para guardar archivos en una carpeta temporal
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.crearDocumento = async (req, res) => {
  try {
    // Obtener el ID del usuario desde el token JWT
    const token = req.headers.authorization;        
    const decoded = jwt.verify(token, process.env.SECRET);// Asegúrate de tener la clave secreta correcta        
    const usuarioId = decoded.id;
    console.log("Token decodificado: "+usuarioId)

    // Crear el nuevo documento asociado al usuario
    const nuevoDocumento = await Documento.create({
      ...req.body,
      PropietarioID: usuarioId,
    });

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
    const decoded = jwt.verify(token, process.env.SECRET); // Reemplaza 'secreto' con tu clave secreta JWT      
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


exports.encriptarDocumento = async (req, res) => {
  try {
    const { nombre_documento, documento, claveDeEncriptacion, FechaCarga } = req.body;

    if (!documento || !claveDeEncriptacion) {
      return res.status(400).json({ mensaje: 'No se proporcionó un archivo o una clave de encriptación' });
    }

    // Obtener el ID del usuario desde el token JWT
    const token = req.headers.authorization;        
    const decoded = jwt.verify(token, process.env.SECRET);// Asegúrate de tener la clave secreta correcta        
    const PropietarioID = decoded.id;

    // Encripta el archivo utilizando la clave proporcionada
    const cipher = crypto.createCipher('aes-256-cbc', claveDeEncriptacion);
    let encryptedData = cipher.update(documento, 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    

    // Guarda el archivo en la base de datos
    const nuevoDocumento = await Documento.create({
      NombreDocumento: nombre_documento, // Puedes proporcionar un nombre si es relevante
      TipoDocumento: 'DLSE', // Puedes proporcionar un tipo MIME adecuado
      DatosDocumento: encryptedData,
      FechaCarga: FechaCarga || new Date(), // Puedes usar la fecha proporcionada o la fecha actual
      PropietarioID: PropietarioID || 0, // Puedes usar el PropietarioID proporcionado o un valor predeterminado
      ClaveDeEncriptacion: claveDeEncriptacion, // Almacena la clave utilizada para futura desencriptación
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
      return res.status(400).json({ mensaje: 'No se proporcionaron datos encriptados o una clave de desencriptación' });
    }

    // Obtén el documento encriptado de la base de datos por su ID
    const documentoEncriptado = await Documento.findByPk(documentoId);

    // Supongamos que documentoEncriptado.DatosDocumento es un búfer
    const datosEnBytes = documentoEncriptado.DatosDocumento;
    const datosEnString = datosEnBytes.toString('utf8');

    console.log(datosEnString)

    // Desencripta los datos utilizando la clave proporcionada
    const decipher = crypto.createDecipher('aes-256-cbc', claveDeEncriptacion);
    let decryptedData = decipher.update(datosEnString, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');

    // Puedes hacer lo que desees con los datos desencriptados, como enviarlos como respuesta
    res.json({ datosDesencriptados: decryptedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al desencriptar el documento' });
  }
};
