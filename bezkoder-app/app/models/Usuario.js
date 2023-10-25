const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Usuario = db.define('Usuario', {
  NombreUsuario: {
    type: DataTypes.STRING,
    allowNull: false
  },
  GoogleUserID: DataTypes.STRING,
  ReconocimientoFacialData: DataTypes.BLOB
});

module.exports = Usuario;
