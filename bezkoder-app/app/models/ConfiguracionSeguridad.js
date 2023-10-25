const { DataTypes } = require('sequelize');
const db = require('../config/database');

const ConfiguracionSeguridad = db.define('ConfiguracionSeguridad', {
  UsuarioID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  MetodoCifradoID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ClaveEncriptacion: {
    type: DataTypes.STRING
  }
});

module.exports = ConfiguracionSeguridad;
