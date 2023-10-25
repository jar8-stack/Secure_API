const Sequelize = require('sequelize');

const db = new Sequelize(process.env.MYSQL_DATABASE, process.env.DB_USER, process.env.MYSQL_ROOT_PASSWORD, {
  host: 'host.docker.internal',
  port: process.env.DB_PORT,
  dialect: 'mysql',
  define: {
    timestamps: false
  }
});

module.exports = db;
