const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cliente = require('./clienteModel');
const Tecnico = require('./tecnicoModel');
const Servico = require('./servicoModel');
const Peca = require('./pecaModel');

const OS = sequelize.define('os', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_cliente: { type: DataTypes.INTEGER, references: { model: Cliente, key: 'id' } },
  id_tecnico: { type: DataTypes.INTEGER, references: { model: Tecnico, key: 'id' } },
  eletrodomestico: { type: DataTypes.STRING },
  descricao_problema: { type: DataTypes.TEXT },
  data_agendada: { type: DataTypes.DATE },
  status: { type: DataTypes.STRING },
  aberta_em: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  atualizada_em: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  id_servico: { type: DataTypes.INTEGER, references: { model: Servico, key: 'id' } },
  id_peca: { type: DataTypes.INTEGER, references: { model: Peca, key: 'id' } },
  quantidade_pecas: { type: DataTypes.INTEGER }
}, { timestamps: false, tableName: 'os' });

OS.belongsTo(Cliente, { foreignKey: 'id_cliente' });
OS.belongsTo(Tecnico, { foreignKey: 'id_tecnico' });
OS.belongsTo(Servico, { foreignKey: 'id_servico' });
OS.belongsTo(Peca, { foreignKey: 'id_peca' });

module.exports = OS;