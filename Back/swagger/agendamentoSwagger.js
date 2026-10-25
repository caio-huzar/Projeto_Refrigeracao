const agendamentoSwagger = {
    paths: {
        '/agendamentos': {
            get: {
                tags: ['Agendamentos'],

                summary: 'Lista os agendamentos',

                parameters: [
                    {
                        name: 'status',
                        in: 'query',
                        required: false,

                        schema: {
                            type: 'string',

                            enum: [
                                'pendente',
                                'confirmado',
                                'cancelado'
                            ]
                        },

                        description: 'Filtra pelo status do agendamento'
                    },

                    {
                        name: 'id_os',
                        in: 'query',
                        required: false,

                        schema: {
                            type: 'integer'
                        },

                        description: 'Filtra pela ordem de servico'
                    }
                ],

                responses: {
                    200: {
                        description: 'Lista de agendamentos retornada com sucesso'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            post: {
                tags: ['Agendamentos'],

                summary: 'Cria um agendamento para uma ordem de servico',

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                properties: {
                                    id_os: {
                                        type: 'integer',
                                        example: 1
                                    },

                                    id_horario: {
                                        type: 'integer',
                                        example: 1
                                    }
                                },

                                required: [
                                    'id_os',
                                    'id_horario'
                                ]
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: 'Agendamento criado com sucesso'
                    },

                    400: {
                        description: 'Dados invalidos'
                    },

                    404: {
                        description: 'Ordem de servico ou horario nao encontrado'
                    },

                    409: {
                        description: 'Ordem de servico nao esta aberta ou horario indisponivel'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        },

        '/agendamentos/{id}': {
            get: {
                tags: ['Agendamentos'],

                summary: 'Busca um agendamento pelo ID',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do agendamento'
                    }
                ],

                responses: {
                    200: {
                        description: 'Agendamento encontrado'
                    },

                    404: {
                        description: 'Agendamento nao encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        },

        '/agendamentos/{id}/confirmar': {
            patch: {
                tags: ['Agendamentos'],

                summary: 'Confirma um agendamento pendente',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do agendamento'
                    }
                ],

                responses: {
                    200: {
                        description: 'Agendamento confirmado com sucesso'
                    },

                    404: {
                        description: 'Agendamento nao encontrado'
                    },

                    409: {
                        description: 'Agendamento nao esta pendente'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        },

        '/agendamentos/{id}/cancelar': {
            patch: {
                tags: ['Agendamentos'],

                summary: 'Cancela um agendamento e libera o horario',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do agendamento'
                    }
                ],

                requestBody: {
                    required: false,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                properties: {
                                    motivo: {
                                        type: 'string',
                                        example: 'Cliente desistiu do atendimento'
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description: 'Agendamento cancelado com sucesso'
                    },

                    404: {
                        description: 'Agendamento nao encontrado'
                    },

                    409: {
                        description: 'Agendamento ja cancelado ou ordem de servico em andamento'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        }
    }
};

module.exports = agendamentoSwagger;
