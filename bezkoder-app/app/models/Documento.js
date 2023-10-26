const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Documento = db.define('Documento', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  NombreDocumento: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  TipoDocumento: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  DatosDocumento: {
    type: DataTypes.BLOB,
    allowNull: false,
  },
  FechaCarga: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  PropietarioID: {
    type: DataTypes.INTEGER,
    allowNull: true, // Puedes ajustar esto según tus necesidades
  },
});

module.exports = Documento;
