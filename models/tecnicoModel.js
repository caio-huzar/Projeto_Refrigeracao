const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tecnico = sequelize.define('tecnicos', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING, allowNulll: false },
  telefone: { type: DataTypes.STRING },
  esta_ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
  criado_em: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { timestamps: false, tableName: 'tecnicos' });

module.exports = Tecnico;