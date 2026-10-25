const Horario = require('../models/HorarioDisponivelModel');

module.exports = {
  async criar(req, res) {
    try {
      const { id_tecnico, dia_semana, hora_inicio, hora_fim, duracao_minutos = 60, esta_ativo = true } = req.body;
      if (id_tecnico == null || dia_semana == null || !hora_inicio || !hora_fim) {
        return res.status(400).json({ mensagem: 'Informe id_tecnico, dia_semana, hora_inicio e hora_fim.' });
      }
      if (!Number.isInteger(Number(dia_semana)) || Number(dia_semana) < 0 || Number(dia_semana) > 6) {
        return res.status(400).json({ mensagem: 'dia_semana deve ser de 0 (domingo) a 6 (sabado).' });
      }
      if (hora_inicio >= hora_fim) return res.status(400).json({ mensagem: 'hora_inicio deve ser anterior a hora_fim.' });
      if (!Number.isInteger(Number(duracao_minutos)) || Number(duracao_minutos) <= 0) {
        return res.status(400).json({ mensagem: 'duracao_minutos deve ser um inteiro maior que zero.' });
      }
      const horario = await Horario.create({ id_tecnico, dia_semana, hora_inicio, hora_fim, duracao_minutos, esta_ativo });
      return res.status(201).json(horario);
    } catch (error) {
      return res.status(400).json({ mensagem: 'Erro ao cadastrar horario.', detalhe: error.message });
    }
  },

  async listar(req, res) {
    try {
      const where = {};
      if (req.query.id_tecnico) where.id_tecnico = req.query.id_tecnico;
      if (req.query.dia_semana !== undefined) where.dia_semana = req.query.dia_semana;
      if (req.query.esta_ativo !== undefined) where.esta_ativo = req.query.esta_ativo === 'true';
      return res.json(await Horario.findAll({ where, order: [['id_tecnico', 'ASC'], ['dia_semana', 'ASC'], ['hora_inicio', 'ASC']] }));
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro ao listar horarios.', detalhe: error.message });
    }
  },

  async buscar(req, res) {
    try {
      const horario = await Horario.findByPk(req.params.id);
      if (!horario) return res.status(404).json({ mensagem: 'Horario nao encontrado.' });
      return res.json(horario);
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro ao buscar horario.', detalhe: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const horario = await Horario.findByPk(req.params.id);
      if (!horario) return res.status(404).json({ mensagem: 'Horario nao encontrado.' });
      const dados = { ...req.body };
      if (dados.dia_semana !== undefined && (!Number.isInteger(Number(dados.dia_semana)) || Number(dados.dia_semana) < 0 || Number(dados.dia_semana) > 6)) {
        return res.status(400).json({ mensagem: 'dia_semana deve ser de 0 a 6.' });
      }
      const inicio = dados.hora_inicio ?? horario.hora_inicio;
      const fim = dados.hora_fim ?? horario.hora_fim;
      if (inicio >= fim) return res.status(400).json({ mensagem: 'hora_inicio deve ser anterior a hora_fim.' });
      await horario.update(dados);
      return res.json(horario);
    } catch (error) {
      return res.status(400).json({ mensagem: 'Erro ao atualizar horario.', detalhe: error.message });
    }
  },

  async excluir(req, res) {
    try {
      const horario = await Horario.findByPk(req.params.id);
      if (!horario) return res.status(404).json({ mensagem: 'Horario nao encontrado.' });
      await horario.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro ao excluir horario.', detalhe: error.message });
    }
  }
};
