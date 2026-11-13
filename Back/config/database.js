require('dotenv').config();
const { Sequelize } = require('sequelize');

const { DB_NAME, DB_REPLICA_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST) {
  throw new Error('Defina DB_NAME, DB_USER, DB_PASSWORD e DB_HOST no arquivo .env');
}

const port = Number(DB_PORT) || 5432;
const replicaDatabase = DB_REPLICA_NAME || `${DB_NAME}_replica`;

// Conexao principal (Primary / Master)
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port,
  dialect: 'postgres',
  logging: false
});

// Conexao secundaria (Replica / Standby) para comprovacao e leitura
const sequelizeReplica = new Sequelize(replicaDatabase, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port,
  dialect: 'postgres',
  logging: false
});

sequelize.replica = sequelizeReplica;
sequelize.replicaDatabaseName = replicaDatabase;

module.exports = sequelize;
