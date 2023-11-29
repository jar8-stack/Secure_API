const Usuario = require('../models/Usuario');
const admin = require('firebase-admin');
const serviceAccount = require('../config/fir-74b7e-firebase-adminsdk-wq6vo-7eaab986da.json');
const firebaseConfig = require('../config/firebaseConfig');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { use } = require('passport');
const axios = require('axios');

//const cv = require('opencv4nodejs');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), // Asegúrate de definir "serviceAccount" correctamente
  databaseURL: firebaseConfig.databaseURL,
});


exports.obtenerInformacionUsuario = async (req, res) => {
  try {
    // Obtener el token desde el encabezado de la solicitud
    const token = req.headers.authorization.split(' ')[1]; // Suponiendo que el token está en el formato "Bearer <token>"

    // Verificar y decodificar el token
    const decodedToken = jwt.verify(token, process.env.SECRET);

    // Obtener información del usuario desde la base de datos
    const user = await Usuario.findByPk(decodedToken.id, {  
      attributes: ['ID', 'CorreoElectronico', 'GoogleUserID', 'ReconocimientoFacialData', 'NombreCompleto', 'FechaNacimiento', 'Genero', 'Telefono', 'NombreUsuario'],
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la información del usuario' });
  }
};

exports.LoginFacial = async (req, res) => {
  try {
    const { base64String, email } = req.body;

    // Buscar al usuario por su correo electrónico en la base de datos
    const user = await Usuario.findOne({ where: { CorreoElectronico: email } });

    const bufferData = Buffer.from(user.ReconocimientoFacialData, 'ascii'); // Reemplaza '6969424f...' con tus datos reales

    // Convertir el búfer a una cadena Base64
    const base64StringData = bufferData.toString('utf8');

    //console.log(base64StringData);
    let pass = false;

    // Verificar si el usuario no fue encontrado
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    } else {
      // Realizar una solicitud HTTP en el bloque else
      try {
        const data = {
          image_base64_1: base64String,
          image_base64_2: base64StringData,
        };

        const url = 'http://host.docker.internal:4545/compare_faces';
        axios.post(url, data, {
          headers: {
            'Content-Type': 'application/json',
            'Cookie': 'connect.sid=s%3AyK8rig9VzQBVT63kvShKSR615lkJla0p.GtD8Ygm2WCPPb8JK3%2Fa7MzPCt0ygzUQSUR%2BFAFpewEg',
          },
        })
          .then(response => {
            //console.log('Respuesta de la solicitud:', response.data);
            if (response.data.similarity_percentage > 50) {              
              pass = true;              
              if (pass) {                
                const token = jwt.sign(
                  { id: user.id, correoElectronico: user.CorreoElectronico },
                  process.env.SECRET,
                  { expiresIn: '1h' }
                );                

                res.status(201).json({ token, mensaje: 'Registro exitoso' });
              }
            } else {              
              res.status(500).json({ error: 'Error al iniciar sesión' });
            }
          })
          .catch(error => {
            console.error('Error en la solicitud:', error.response.status, error.response.statusText);
          });
      } catch (error) {
        console.error('Error al hacer la solicitud:', error.message);
      }

      //return res.status(200).json({ message: 'Usuario encontrado', user });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};


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
    const { tipoRegistro, correo, contrasena, imagenPerfil, nombreCompleto, fechaNacimiento, genero, telefono, nombreUsuario, googleUserId } = req.body;

    if (tipoRegistro === 'normal') {
      // Encriptar la contraseña antes de guardarla en la base de datos
      const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);

      const nuevoUsuario = await Usuario.create({
        CorreoElectronico: correo,
        Contrasena: contrasenaEncriptada,
        ReconocimientoFacialData: imagenPerfil,
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
    } else if (tipoRegistro == 'google') {
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
        GoogleUserID: googleUserId
        // Otros campos de información de usuario según la base de datos
      });

      const token = jwt.sign(
        { id: nuevoUsuario.id, correoElectronico: nuevoUsuario.CorreoElectronico },
        process.env.SECRET,
        { expiresIn: '1h' }
      );

      res.status(201).json({ token, mensaje: 'Registro de google exitoso' });
    }
    else {
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

exports.actualizarReconocimientoFacial = async (req, res) => {
  try {
    const { email, nuevoBase64String } = req.body;

    // Buscar al usuario por su correo electrónico en la base de datos
    const user = await Usuario.findOne({ where: { CorreoElectronico: email } });

    // Verificar si el usuario no fue encontrado
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar el campo ReconocimientoFacialData con el nuevo base64 string
    user.ReconocimientoFacialData = nuevoBase64String;
    await user.save();

    res.json({ message: 'Actualización exitosa' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el reconocimiento facial' });
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