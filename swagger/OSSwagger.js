const osSwagger = {
    paths: {

        // LISTAR ORDENS DE SERVIÇO
        '/os': {
            get: {
                tags: ['Ordens de Serviço'],
                summary: 'Lista todas as ordens de serviço',

                responses: {
                    200: {
                        description: 'Lista de ordens de serviço retornada com sucesso'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            // INSERIR ORDEM DE SERVIÇO
            post: {
                tags: ['Ordens de Serviço'],
                summary: 'Cadastra uma nova ordem de serviço',

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
                                        example: 'Geladeira não está refrigerando'
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
                        description: 'Ordem de serviço cadastrada com sucesso'
                    },

                    400: {
                        description: 'Dados inválidos'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        },

        // BUSCAR ORDEM DE SERVIÇO POR ID
        '/os/{id}': {

            get: {
                tags: ['Ordens de Serviço'],
                summary: 'Busca uma ordem de serviço pelo ID',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID da ordem de serviço'
                    }
                ],

                responses: {
                    200: {
                        description: 'Ordem de serviço encontrada'
                    },

                    404: {
                        description: 'Ordem de serviço não encontrada'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            // ALTERAR ORDEM DE SERVIÇO
            put: {
                tags: ['Ordens de Serviço'],
                summary: 'Altera uma ordem de serviço',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID da ordem de serviço'
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
                                        example: 'Geladeira não está refrigerando'
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
                        description: 'Ordem de serviço alterada com sucesso'
                    },

                    404: {
                        description: 'Ordem de serviço não encontrada'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            // EXCLUIR ORDEM DE SERVIÇO
            delete: {
                tags: ['Ordens de Serviço'],
                summary: 'Exclui uma ordem de serviço',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID da ordem de serviço'
                    }
                ],

                responses: {
                    200: {
                        description: 'Ordem de serviço excluída com sucesso'
                    },

                    404: {
                        description: 'Ordem de serviço não encontrada'
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