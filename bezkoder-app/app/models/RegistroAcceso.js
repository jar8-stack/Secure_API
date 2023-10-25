const { DataTypes } = require('sequelize');
const db = require('../config/database');

const RegistroAcceso = db.define('RegistroAcceso', {
  FechaHoraAcceso: {
    type: DataTypes.DATE,
    allowNull: false
  },
  UsuarioID: {
    type: DataTypes.INTEGER, // Asegúrate de usar el tipo de datos correcto
    allowNull: true, // Indica si este campo puede ser nulo o no, según tus necesidades
  },
  DocumentoID: {
    type: DataTypes.INTEGER, // Asegúrate de usar el tipo de datos correcto
    allowNull: true, // Indica si este campo puede ser nulo o no, según tus necesidades
  }
});

module.exports = RegistroAcceso;
