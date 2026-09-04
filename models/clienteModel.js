const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');

const Cliente = sequelize.define('clientes', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_usuario: { type: DataTypes.INTEGER, allowNulll: false , references: { model: User, key: 'id' } },
  nome: { type: DataTypes.STRING, allowNulll: false },
  telefone: { type: DataTypes.STRING, allowNulll: false },
  cpf_cnpj: { type: DataTypes.STRING, allowNulll: false },
  rua: { type: DataTypes.STRING, allowNulll: false },
  numero_casa: { type: DataTypes.INTEGER, allowNulll: false },
  bairro: { type: DataTypes.STRING, allowNulll: false },
  cep: { type: DataTypes.STRING, allowNulll: false },
  cidade: { type: DataTypes.STRING, allowNulll: false },
  estado: { type: DataTypes.STRING, allowNulll: false }
}, { timestamps: false, tableName: 'clientes' });

Cliente.belongsTo(User, { foreignKey: 'id_usuario' });
module.exports = Cliente;