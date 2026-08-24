const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Servico = sequelize.define('servicos', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING, allowNulll: false },
  descricao: { type: DataTypes.TEXT },
  valor: { type: DataTypes.DECIMAL(10, 2) }
}, { timestamps: false, tableName: 'servicos' });

module.exports = Servico;