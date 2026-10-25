const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const OS = require('./OSModel');

const Orcamento = sequelize.define('orcamentos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_os: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: OS,
      key: 'id'
    }
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'rascunho',
    validate: {
      isIn: [['rascunho', 'enviado', 'aprovado', 'recusado', 'cancelado']]
    }
  },
  validade: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  criado_em: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  atualizado_em: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false,
  tableName: 'orcamentos'
});

Orcamento.belongsTo(OS, { foreignKey: 'id_os', as: 'os' });

module.exports = Orcamento;