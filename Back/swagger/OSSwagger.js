const osSwagger = {
    paths: {

        '/os': {
            get: {
                tags: ['Ordens de Servico'],
                summary: 'Lista todas as ordens de servico',

                responses: {
                    200: {
                        description: 'Lista de ordens de servico retornada com sucesso'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            post: {
                tags: ['Ordens de Servico'],
                summary: 'Cadastra uma nova ordem de servico',

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                properties: {
                                    id_cliente: {
                                        type: 'integer',
                                        example: 1
                                    },

                                    id_tecnico: {
                                        type: 'integer',
                                        example: 1
                                    },

                                    eletrodomestico: {
                                        type: 'string',
                                        example: 'Geladeira'
                                    },

                                    descricao_problema: {
                                        type: 'string',
                                        example: 'Geladeira nao esta refrigerando'
                                    },

                                    data_agendada: {
                                        type: 'string',
                                        format: 'date-time',
                                        example: '2026-09-10T14:00:00'
                                    },

                                    status: {
                                        type: 'string',
                                        enum: [
                                            'aberta',
                                            'agendada',
                                            'em_andamento',
                                            'concluida',
                                            'cancelada'
                                        ],
                                        example: 'aberta'
                                    },

                                    id_servico: {
                                        type: 'integer',
                                        example: 1
                                    },

                                    id_peca: {
                                        type: 'integer',
                                        example: 1
                                    },

                                    quantidade_pecas: {
                                        type: 'integer',
                                        example: 2
                                    }
                                },

                                required: [
                                    'id_cliente',
                                    'id_tecnico',
                                    'eletrodomestico',
                                    'descricao_problema'
                                ]
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: 'Ordem de servico cadastrada com sucesso'
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

        '/os/{id}': {

            get: {
                tags: ['Ordens de Servico'],
                summary: 'Busca uma ordem de servico pelo ID',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID da ordem de servico'
                    }
                ],

                responses: {
                    200: {
                        description: 'Ordem de servico encontrada'
                    },

                    404: {
                        description: 'Ordem de servico nao encontrada'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            put: {
                tags: ['Ordens de Servico'],
                summary: 'Altera uma ordem de servico',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID da ordem de servico'
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                properties: {
                                    id_cliente: {
                                        type: 'integer',
                                        example: 1
                                    },

                                    id_tecnico: {
                                        type: 'integer',
                                        example: 1
                                    },

                                    eletrodomestico: {
                                        type: 'string',
                                        example: 'Geladeira'
                                    },

                                    descricao_problema: {
                                        type: 'string',
                                        example: 'Geladeira nao esta refrigerando'
                                    },

                                    data_agendada: {
                                        type: 'string',
                                        format: 'date-time',
                                        example: '2026-09-10T14:00:00'
                                    },

                                    status: {
                                        type: 'string',
                                        enum: [
                                            'aberta',
                                            'agendada',
                                            'em_andamento',
                                            'concluida',
                                            'cancelada'
                                        ],
                                        example: 'em_andamento'
                                    },

                                    id_servico: {
                                        type: 'integer',
                                        example: 1
                                    },

                                    id_peca: {
                                        type: 'integer',
                                        example: 1
                                    },

                                    quantidade_pecas: {
                                        type: 'integer',
                                        example: 2
                                    }
                                },

                                required: [
                                    'id_cliente',
                                    'id_tecnico',
                                    'eletrodomestico',
                                    'descricao_problema'
                                ]
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description: 'Ordem de servico alterada com sucesso'
                    },

                    404: {
                        description: 'Ordem de servico nao encontrada'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            delete: {
                tags: ['Ordens de Servico'],
                summary: 'Exclui uma ordem de servico',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID da ordem de servico'
                    }
                ],

                responses: {
                    200: {
                        description: 'Ordem de servico excluida com sucesso'
                    },

                    404: {
                        description: 'Ordem de servico nao encontrada'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        }
    }
};

module.exports = osSwagger;