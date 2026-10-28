const sequelize = require('../config/database');
const OS = require('../models/OSModel');
const Peca = require('../models/pecaModel');
const OsPeca = require('../models/OsPecaModel');
const { pertenceAoCliente } = require('../utils/escopoCliente');

module.exports = {
  async registrar(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const id_os = Number(req.params.id);
      const { id_peca, quantidade } = req.body;
      const qtd = Number(quantidade);

      if (!Number.isInteger(id_os) || id_os <= 0 || !id_peca || !Number.isInteger(qtd) || qtd <= 0) {
        await transaction.rollback();
        return res.status(400).json({ mensagem: 'Informe id_peca e uma quantidade inteira maior que zero.' });
      }

      const os = await OS.findByPk(id_os, { transaction, lock: transaction.LOCK.UPDATE });
      if (!os) {
        await transaction.rollback();
        return res.status(404).json({ mensagem: 'Ordem de servico nao encontrada.' });
      }
      if (['concluida', 'cancelada'].includes(os.status)) {
        await transaction.rollback();
        return res.status(409).json({ mensagem: 'Nao e possivel adicionar pecas a uma OS concluida ou cancelada.' });
      }

      const peca = await Peca.findByPk(id_peca, { transaction, lock: transaction.LOCK.UPDATE });
      if (!peca) {
        await transaction.rollback();
        return res.status(404).json({ mensagem: 'Peca nao encontrada.' });
      }
      if (Number(peca.quantidade) < qtd) {
        await transaction.rollback();
        return res.status(409).json({ mensagem: 'Estoque insuficiente.', estoque_disponivel: peca.quantidade });
      }

      await peca.update({ quantidade: Number(peca.quantidade) - qtd }, { transaction });

      const registro = await OsPeca.create({
        id_os, id_peca, quantidade: qtd, preco_unitario: peca.preco_venda
      }, { transaction });

      await transaction.commit();
      return res.status(201).json({
        mensagem: 'Peca registrada na OS e estoque atualizado.',
        registro,
        estoque_restante: Number(peca.quantidade) - qtd
      });
    } catch (error) {
      if (!transaction.finished) await transaction.rollback();
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ mensagem: 'Essa peca ja foi registrada nesta OS. Ajuste o registro existente ou implemente suporte a multiplas linhas por peca.' });
      }
      return res.status(500).json({ mensagem: 'Erro ao registrar peca na OS.', detalhe: error.message });
    }
  },

  async listar(req, res) {
    try {
      const os = await OS.findByPk(req.params.id);
      if (!os || !pertenceAoCliente(req, os.id_cliente)) {
        return res.status(404).json({ mensagem: 'Ordem de servico nao encontrada.' });
      }
      const itens = await OsPeca.findAll({ where: { id_os: os.id }, include: [{ model: Peca, attributes: ['id', 'nome', 'preco_venda'] }] });
      return res.json(itens);
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro ao listar pecas da OS.', detalhe: error.message });
    }
  }
};
