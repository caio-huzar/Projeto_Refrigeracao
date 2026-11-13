const replicacaoSwagger = {
  paths: {
    '/replicacao/status': {
      get: {
        tags: ['Replicacao de Dados'],
        summary: 'Exibe o status da replicacao, comparativo de registros entre Banco Principal e Replica, triggers ativas e ultimos logs',
        responses: {
          200: {
            description: 'Relatorio de sincronia entre o banco principal (projeto_refri) e a replica (projeto_refri_replica)'
          },
          500: {
            description: 'Erro ao consultar status da replicacao'
          }
        }
      }
    },
    '/replicacao/sincronizar': {
      post: {
        tags: ['Replicacao de Dados'],
        summary: 'Forca a verificacao estrutural (FDW + Triggers) e sincroniza quaisquer registros pendentes para o banco replica',
        responses: {
          200: {
            description: 'Sincronizacao concluida com sucesso'
          },
          500: {
            description: 'Erro durante a sincronizacao'
          }
        }
      }
    },
    '/replicacao/testar': {
      post: {
        tags: ['Replicacao de Dados'],
        summary: 'Executa um teste real de INSERT, UPDATE e DELETE no banco principal e comprova a replicacao imediata no banco replica',
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  manter_registro: {
                    type: 'boolean',
                    example: false,
                    description: 'Se true, mantem o servico criado em ambos os bancos para visualizacao manual no pgAdmin'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Comprovacao passo a passo da replicacao automatica e logs de auditoria gerados'
          },
          500: {
            description: 'Erro ao executar teste de replicacao'
          }
        }
      }
    },
    '/replicacao/comparar/{tabela}': {
      get: {
        tags: ['Replicacao de Dados'],
        summary: 'Compara lado a lado os dados de uma tabela no Banco Principal e no Banco Replica',
        parameters: [
          {
            name: 'tabela',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              enum: [
                'usuarios',
                'clientes',
                'tecnicos',
                'servicos',
                'pecas',
                'os',
                'os_pecas',
                'horarios_disponiveis',
                'agendamentos',
                'orcamentos'
              ]
            },
            description: 'Nome da tabela a ser comparada entre os dois bancos'
          }
        ],
        responses: {
          200: {
            description: 'Registros retornados diretamente do banco principal e do banco replica'
          },
          400: {
            description: 'Nome de tabela invalido'
          }
        }
      }
    }
  }
};

module.exports = replicacaoSwagger;
