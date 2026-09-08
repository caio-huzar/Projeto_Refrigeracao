const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Peca = sequelize.define('pecas', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  descricao: {
    type: DataTypes.STRING(500),
    allowNull: true
  },

  preco_custo: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },

  preco_venda: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },

  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  fornecedor: {
    type: DataTypes.STRING(100),
    allowNull: true
  },

  codigo_barras: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: true
  }

}, {
  timestamps: false,
  tableName: 'pecas'
});

module.exports = Peca;