const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Usuario = db.define('Usuario', {
  NombreUsuario: {
    type: DataTypes.STRING,
    allowNull: false
  },
  CorreoElectronico: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  Contrasena: DataTypes.STRING, // Asegúrate de almacenar contraseñas de forma segura
  GoogleUserID: DataTypes.STRING,
  ReconocimientoFacialData: DataTypes.BLOB,
  NombreCompleto: DataTypes.STRING,
  FechaNacimiento: DataTypes.DATE,
  Genero: DataTypes.ENUM('Masculino', 'Femenino', 'Otro'),
  Telefono: DataTypes.STRING,  
  // Otros campos de información de usuario según la base de datos
});

module.exports = Usuario;