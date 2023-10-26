const Usuario = require('../models/Usuario');
const admin = require('firebase-admin');
const serviceAccount = require('../config/fir-74b7e-firebase-adminsdk-wq6vo-7eaab986da.json'); 
const firebaseConfig  = require('../config/firebaseConfig');

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
    const { tipoRegistro, correo, contrasena, googleUserId, reconocimientoFacialData, nombreCompleto, fechaNacimiento, genero, telefono, nombreUsuario } = req.body;

    if (tipoRegistro === 'normal') {
      // Registro con correo y contraseña
      const nuevoUsuario = await Usuario.create({
        CorreoElectronico: correo,
        Contrasena: contrasena, // Asegúrate de almacenar la contraseña de forma segura
        NombreCompleto: nombreCompleto,
        FechaNacimiento: fechaNacimiento,
        Genero: genero,
        Telefono: telefono,
        NombreUsuario: nombreUsuario,
        // Otros campos de información de usuario según la base de datos
      });
      res.status(201).json({ mensaje: 'Registro exitoso' });
    } else {
      res.status(400).json({ mensaje: 'Tipo de registro no válido' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear usuario' });
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

      // Puedes realizar más acciones, como almacenar la foto del perfil en tu servidor o proporcionar un token de sesión
      res.status(201).json({ mensaje: 'Registro exitoso con Google' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar con Google' });
  }
};
