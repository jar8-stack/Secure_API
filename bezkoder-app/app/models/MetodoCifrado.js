const { DataTypes } = require('sequelize');
const db = require('../config/database');

const MetodoCifrado = db.define('MetodosCifrado', {
  NombreMetodo: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = MetodoCifrado;
