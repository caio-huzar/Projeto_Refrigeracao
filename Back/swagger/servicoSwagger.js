const servicoSwagger = {
    paths: {

        '/servicos': {
            get: {
                tags: ['Servicos'],
                summary: 'Lista todos os servicos',

                responses: {
                    200: {
                        description: 'Lista de servicos retornada com sucesso'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            post: {
                tags: ['Servicos'],
                summary: 'Cadastra um novo servico',

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                properties: {
                                    nome: {
                                        type: 'string',
                                        example: 'Manutencao de geladeira'
                                    },

                                    descricao: {
                                        type: 'string',
                                        example: 'Manutencao completa do sistema de refrigeracao'
                                    },

                                    valor: {
                                        type: 'number',
                                        format: 'double',
                                        example: 250.00
                                    }
                                },

                                required: [
                                    'nome',
                                    'valor'
                                ]
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: 'Servico cadastrado com sucesso'
                    },

                    400: {
                        description: 'Dados invalidos'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        },

        '/servicos/{id}': {

            get: {
                tags: ['Servicos'],
                summary: 'Busca um servico pelo ID',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do servico'
                    }
                ],

                responses: {
                    200: {
                        description: 'Servico encontrado'
                    },

                    404: {
                        description: 'Servico nao encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            put: {
                tags: ['Servicos'],
                summary: 'Altera um servico',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do servico'
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                properties: {
                                    nome: {
                                        type: 'string',
                                        example: 'Manutencao de geladeira'
                                    },

                                    descricao: {
                                        type: 'string',
                                        example: 'Manutencao completa do sistema de refrigeracao'
                                    },

                                    valor: {
                                        type: 'number',
                                        format: 'double',
                                        example: 250.00
                                    }
                                },

                                required: [
                                    'nome',
                                    'valor'
                                ]
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description: 'Servico alterado com sucesso'
                    },

                    404: {
                        description: 'Servico nao encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            delete: {
                tags: ['Servicos'],
                summary: 'Exclui um servico',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do servico'
                    }
                ],

                responses: {
                    200: {
                        description: 'Servico excluido com sucesso'
                    },

                    404: {
                        description: 'Servico nao encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        }
    }
};

module.exports = servicoSwagger;