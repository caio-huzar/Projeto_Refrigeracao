const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const OS = require('./OSModel');
const Peca = require('./pecaModel');

const OsPeca = sequelize.define('os_pecas', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_os: {
    type: DataTypes.INTEGER, allowNull: false,
    references: { model: OS, key: 'id' }
  },
  id_peca: {
    type: DataTypes.INTEGER, allowNull: false,
    references: { model: Peca, key: 'id' }
  },
  quantidade: { type: DataTypes.INTEGER, allowNull: false },
  preco_unitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, {
  timestamps: false,
  tableName: 'os_pecas',
  indexes: [{ unique: true, fields: ['id_os', 'id_peca'] }],
  validate: {
    quantidadePositiva() {
      if (!Number.isInteger(this.quantidade) || this.quantidade <= 0) throw new Error('quantidade deve ser um inteiro maior que zero.');
    }
  }
});

OsPeca.belongsTo(OS, { foreignKey: 'id_os' });
OsPeca.belongsTo(Peca, { foreignKey: 'id_peca' });
module.exports = OsPeca;
