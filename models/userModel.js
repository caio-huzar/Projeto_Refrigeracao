const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ajuste o caminho do seu banco

const User = sequelize.define('usuarios', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNulll: false, unique: true },
  senha_hash: { type: DataTypes.STRING, allowNulll: false },
  cargo: { type: DataTypes.STRING },
  esta_ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
  criado_em: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  atualizado_em: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { timestamps: false, tableName: 'usuarios' });

module.exports = User;