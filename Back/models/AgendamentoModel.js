const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cliente = require('./clienteModel');
const Tecnico = require('./tecnicoModel');

const Agendamento = sequelize.define('agendamentos', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_cliente: {
    type: DataTypes.INTEGER, allowNull: false,
    references: { model: Cliente, key: 'id' }
  },
  id_tecnico: {
    type: DataTypes.INTEGER, allowNull: false,
    references: { model: Tecnico, key: 'id' }
  },
  data_hora: { type: DataTypes.DATE, allowNull: false },
  status: {
    type: DataTypes.ENUM('pendente', 'confirmado', 'cancelado'),
    allowNull: false, defaultValue: 'pendente'
  },
  observacao: { type: DataTypes.STRING(1000), allowNull: true },
  criado_em: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  atualizado_em: { type: DataTypes.DATE, allowNull: true }
}, { timestamps: false, tableName: 'agendamentos' });

Agendamento.belongsTo(Cliente, { foreignKey: 'id_cliente' });
Agendamento.belongsTo(Tecnico, { foreignKey: 'id_tecnico' });

module.exports = Agendamento;
