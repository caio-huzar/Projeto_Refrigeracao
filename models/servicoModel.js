const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Servico = sequelize.define('servicos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  nome: {
    type: DataTypes.STRING(200),
    allowNull: false
  },

  descricao: {
    type: DataTypes.STRING(1000),
    allowNull: true
  },

  valor: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false
  }

}, {
  timestamps: false,
  tableName: 'servicos'
});

module.exports = Servico;