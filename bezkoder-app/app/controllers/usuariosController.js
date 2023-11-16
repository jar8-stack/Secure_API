const Usuario = require('../models/Usuario');
const admin = require('firebase-admin');
const serviceAccount = require('../config/fir-74b7e-firebase-adminsdk-wq6vo-7eaab986da.json'); 
const firebaseConfig  = require('../config/firebaseConfig');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//const cv = require('opencv4nodejs');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), // Asegúrate de definir "serviceAccount" correctamente
  databaseURL: firebaseConfig.databaseURL,
});

exports.crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = await Usuario.create(req.body);
    res.json(nuevoUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

exports.registrarUsuario = async (req, res) => {
  try {
    const { tipoRegistro, correo, contrasena, nombreCompleto, fechaNacimiento, genero, telefono, nombreUsuario } = req.body;

    if (tipoRegistro === 'normal') {
      // Encriptar la contraseña antes de guardarla en la base de datos
      const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);

      const nuevoUsuario = await Usuario.create({
        CorreoElectronico: correo,
        Contrasena: contrasenaEncriptada,
        NombreCompleto: nombreCompleto,
        FechaNacimiento: fechaNacimiento,
        Genero: genero,
        Telefono: telefono,
        NombreUsuario: nombreUsuario,
        // Otros campos de información de usuario según la base de datos
      });

      const token = jwt.sign(
        { id: nuevoUsuario.id, correoElectronico: nuevoUsuario.CorreoElectronico },
        process.env.SECRET,
        { expiresIn: '1h' }
      );

      res.status(201).json({ token, mensaje: 'Registro exitoso' });
    } else {
      res.status(400).json({ mensaje: 'Tipo de registro no válido' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

exports.iniciarSesion = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { CorreoElectronico: correo } });

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.Contrasena);

    if (!contrasenaValida) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, correoElectronico: usuario.CorreoElectronico },
      process.env.SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};


exports.registrarUsuarioConGoogle = async (req, res) => {
  try {
    const { email, googleId, displayName, phoneNumber, nombreCompleto, fechaNacimiento, genero, telefono, nombreUsuario } = req.body; // Datos que provienen de la autenticación de Firebase

    // Verifica si el usuario ya existe en tu base de datos utilizando el correo electrónico
    const usuarioExistente = await Usuario.findOne({
      where: {
        CorreoElectronico: email,
      },
    });

    if (usuarioExistente) {
      // El usuario ya está registrado en tu base de datos
      res.status(200).json({ mensaje: 'Usuario ya registrado' });
    } else {
      // El usuario no existe en tu base de datos, regístralo
      const nuevoUsuario = await Usuario.create({
        GoogleUserID: googleId, // ID de Google
        CorreoElectronico: email,
        NombreCompleto: nombreCompleto,
        FechaNacimiento: fechaNacimiento,
        Genero: genero,
        Telefono: telefono,
        NombreUsuario: nombreUsuario,
        // Otros campos según el modelo
      });

      const token = jwt.sign(
        { id: nuevoUsuario.id, correoElectronico: nuevoUsuario.CorreoElectronico },
        process.env.SECRET,
        { expiresIn: '1h' }
      );

      res.status(201).json({ token, mensaje: 'Registro exitoso con google' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar con Google' });
  }
};

/*

exports.authenticateWithFacialRecognition = async (req, res) => {
  const { username, imageBase64 } = req.body; // Suponiendo que se envía el nombre de usuario y la imagen en base64

  // Obtén el usuario desde la base de datos por nombre de usuario
  const user = await User.findOne({ where: { username } });

  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  // Decodifica la imagen en base64 y conviértela a una matriz de píxeles
  const imgData = Buffer.from(imageBase64, 'base64');
  const img = cv.imdecode(imgData);

  // Realiza el reconocimiento facial y verifica si coincide con el usuario
  // Aquí deberías implementar la lógica de reconocimiento facial

  // Por ejemplo, podrías comparar la imagen con las imágenes almacenadas en el perfil del usuario
  const userImages = user.get('facialImages'); // Suponiendo que tienes un campo 'facialImages' en tu modelo de usuario
  const similarityThreshold = 0.7; // Umbral de similitud

  // Implementa la lógica de comparación de imágenes para verificar si coincide con el usuario

  if (similarity >= similarityThreshold) {
    return res.json({ message: 'Autenticación exitosa' });
  } else {
    return res.status(401).json({ message: 'Autenticación fallida' });
  }
};

*/