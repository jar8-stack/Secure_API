const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Documento = db.define('Documento', {
  NombreDocumento: {
    type: DataTypes.STRING,
    allowNull: false
  },
  TipoDocumento: {
    type: DataTypes.STRING,
    allowNull: false
  },
  DatosDocumento: {
    type: DataTypes.BLOB,
    allowNull: false
  },
  FechaCarga: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

module.exports = Documento;
