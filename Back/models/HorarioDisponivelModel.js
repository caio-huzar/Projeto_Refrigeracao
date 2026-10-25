const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Tecnico = require('./tecnicoModel');

const HorarioDisponivel = sequelize.define('horarios_disponiveis', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_tecnico: {
    type: DataTypes.INTEGER, allowNull: false,
    references: { model: Tecnico, key: 'id' }
  },
  dia_semana: { type: DataTypes.SMALLINT, allowNull: false },
  hora_inicio: { type: DataTypes.TIME, allowNull: false },
  hora_fim: { type: DataTypes.TIME, allowNull: false },
  duracao_minutos: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 60 },
  esta_ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
  timestamps: false,
  tableName: 'horarios_disponiveis',
  validate: {
    diaSemanaValido() {
      if (this.dia_semana < 0 || this.dia_semana > 6) throw new Error('dia_semana deve ser de 0 (domingo) a 6 (sabado).');
    },
    intervaloValido() {
      if (this.hora_inicio >= this.hora_fim) throw new Error('hora_inicio deve ser anterior a hora_fim.');
    },
    duracaoValida() {
      if (this.duracao_minutos <= 0) throw new Error('duracao_minutos deve ser maior que zero.');
    }
  }
});

HorarioDisponivel.belongsTo(Tecnico, { foreignKey: 'id_tecnico' });
module.exports = HorarioDisponivel;
