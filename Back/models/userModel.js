const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('usuarios', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true
  },

  senha_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },

  cargo: {
    type: DataTypes.ENUM('cliente', 'funcionario'),
    allowNull: false
  },

  esta_ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  criado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },

  atualizado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }

}, {
  timestamps: false,
  tableName: 'usuarios'
});

module.exports = User;