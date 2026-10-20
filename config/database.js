require('dotenv').config();
const { Sequelize } = require('sequelize');

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST) {
  throw new Error('Defina DB_NAME, DB_USER, DB_PASSWORD e DB_HOST no arquivo .env');
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT || 5432,
  dialect: 'postgres',
  logging: false
});

module.exports = sequelize;