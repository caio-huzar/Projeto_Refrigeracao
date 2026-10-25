const orcamentoSwagger = {
  paths: {
    '/orcamentos': {
      get: {
        tags: ['Orcamentos'],
        summary: 'Lista orcamentos com filtros opcionais',
        parameters: [
          {
            name: 'id_os',
            in: 'query',
            required: false,
            schema: { type: 'integer', minimum: 1 },
            description: 'Filtra pelo ID da ordem de servico'
          },
          {
            name: 'status',
            in: 'query',
            required: false,
            schema: {
              type: 'string',
              enum: ['rascunho', 'enviado', 'aprovado', 'recusado', 'cancelado']
            },
            description: 'Filtra pelo status do orcamento'
          }
        ],
        responses: {
          200: { description: 'Lista de orcamentos retornada com sucesso' },
          400: { description: 'Filtro invalido' },
          500: { description: 'Erro interno do servidor' }
        }
      },
      post: {
        tags: ['Orcamentos'],
        summary: 'Cria um orcamento para uma ordem de servico',
        description: 'O valor total e calculado pela API com base no servico e nas pecas vinculadas a OS.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id_os: { type: 'integer', minimum: 1, example: 1 },
                  validade: { type: 'string', format: 'date', nullable: true, example: '2026-11-30' }
                },
                required: ['id_os']
              }
            }
          }
        },
        responses: {
          201: { description: 'Orcamento criado com valor calculado e status rascunho' },
          400: { description: 'ID da OS ou validade invalida' },
          404: { description: 'Ordem de servico nao encontrada' },
          500: { description: 'Erro interno do servidor' }
        }
      }
    },
    '/orcamentos/{id}': {
      get: {
        tags: ['Orcamentos'],
        summary: 'Busca um orcamento pelo ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', minimum: 1 },
            description: 'ID do orcamento'
          }
        ],
        responses: {
          200: { description: 'Orcamento encontrado, incluindo a ordem de servico' },
          404: { description: 'Orcamento nao encontrado' },
          500: { description: 'Erro interno do servidor' }
        }
      }
    },
    '/orcamentos/{id}/status': {
      patch: {
        tags: ['Orcamentos'],
        summary: 'Atualiza o status de um orcamento',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', minimum: 1 },
            description: 'ID do orcamento'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    enum: ['rascunho', 'enviado', 'aprovado', 'recusado', 'cancelado'],
                    example: 'enviado'
                  }
                },
                required: ['status']
              }
            }
          }
        },
        responses: {
          200: { description: 'Status do orcamento atualizado' },
          400: { description: 'Status invalido' },
          404: { description: 'Orcamento nao encontrado' },
          409: { description: 'Transicao de status nao permitida' },
          500: { description: 'Erro interno do servidor' }
        }
      }
    }
  }
};

module.exports = orcamentoSwagger;