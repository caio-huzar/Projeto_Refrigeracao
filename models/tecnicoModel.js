const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tecnico = sequelize.define('tecnicos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  nome: {
    type: DataTypes.STRING(100),
    allowNull: true
  },

  telefone: {
    type: DataTypes.STRING(11),
    allowNull: true
  },

  esta_ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: true
  },

  criado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: true
  }

}, {
  timestamps: false,
  tableName: 'tecnicos'
});

module.exports = Tecnico;