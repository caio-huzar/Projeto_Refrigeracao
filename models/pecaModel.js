const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Peca = sequelize.define('pecas', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING, allowNulll: false },
  descricao: { type: DataTypes.TEXT },
  preco_custo: { type: DataTypes.DECIMAL(10, 2) },
  preco_venda: { type: DataTypes.DECIMAL(10, 2) },
  quantidade: { type: DataTypes.INTEGER },
  fornecedor: { type: DataTypes.STRING }
}, { timestamps: false, tableName: 'pecas' });

module.exports = Peca;