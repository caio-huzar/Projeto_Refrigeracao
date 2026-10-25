const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');

const Cliente = sequelize.define('clientes', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: User,
      key: 'id'
    }
  },

  nome: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  telefone: {
    type: DataTypes.STRING(11),
    allowNull: false,
    unique: true
  },

  cpf_cnpj: {
    type: DataTypes.STRING(14),
    allowNull: false,
    unique: true
  },

  rua: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  numero_casa: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  bairro: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  cep: {
    type: DataTypes.STRING(8),
    allowNull: false
  },

  cidade: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  estado: {
    type: DataTypes.STRING(30),
    allowNull: false
  }

}, {
  timestamps: false,
  tableName: 'clientes'
});

Cliente.belongsTo(User, {
  foreignKey: 'id_usuario'
});

module.exports = Cliente;