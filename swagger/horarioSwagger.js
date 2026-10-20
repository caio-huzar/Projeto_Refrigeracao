const horarioSwagger = {
    paths: {
        '/horarios': {
            get: {
                tags: ['Horarios'],

                summary: 'Lista os horarios',

                parameters: [
                    {
                        name: 'id_tecnico',
                        in: 'query',
                        required: false,

                        schema: {
                            type: 'integer'
                        },

                        description: 'Filtra pelo tecnico'
                    },

                    {
                        name: 'data',
                        in: 'query',
                        required: false,

                        schema: {
                            type: 'string'
                        },

                        description: 'Filtra pela data (AAAA-MM-DD)'
                    },

                    {
                        name: 'disponivel',
                        in: 'query',
                        required: false,

                        schema: {
                            type: 'boolean'
                        },

                        description: 'Filtra pela disponibilidade'
                    }
                ],

                responses: {
                    200: {
                        description: 'Lista de horarios retornada com sucesso'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            post: {
                tags: ['Horarios'],

                summary: 'Cadastra um novo horario',

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                properties: {
                                    id_tecnico: {
                                        type: 'integer',
                                        example: 1
                                    },

                                    data: {
                                        type: 'string',
                                        format: 'date',
                                        example: '2026-11-10'
                                    },

                                    hora_inicio: {
                                        type: 'string',
                                        example: '08:00'
                                    },

                                    hora_fim: {
                                        type: 'string',
                                        example: '09:00'
                                    },

                                    disponivel: {
                                        type: 'boolean',
                                        example: true
                                    }
                                },

                                required: [
                                    'id_tecnico',
                                    'data',
                                    'hora_inicio',
                                    'hora_fim'
                                ]
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: 'Horario cadastrado com sucesso'
                    },

                    400: {
                        description: 'Dados invalidos ou horario sobreposto'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        },

        '/horarios/{id}': {
            get: {
                tags: ['Horarios'],

                summary: 'Busca um horario pelo ID',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do horario'
                    }
                ],

                responses: {
                    200: {
                        description: 'Horario encontrado'
                    },

                    404: {
                        description: 'Horario nao encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            put: {
                tags: ['Horarios'],

                summary: 'Altera um horario',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do horario'
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                properties: {
                                    id_tecnico: {
                                        type: 'integer',
                                        example: 1
                                    },

                                    data: {
                                        type: 'string',
                                        format: 'date',
                                        example: '2026-11-10'
                                    },

                                    hora_inicio: {
                                        type: 'string',
                                        example: '08:00'
                                    },

                                    hora_fim: {
                                        type: 'string',
                                        example: '09:00'
                                    },

                                    disponivel: {
                                        type: 'boolean',
                                        example: true
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description: 'Horario alterado com sucesso'
                    },

                    400: {
                        description: 'Dados invalidos ou horario sobreposto'
                    },

                    404: {
                        description: 'Horario nao encontrado'
                    },

                    409: {
                        description: 'Horario reservado por um agendamento ativo'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            delete: {
                tags: ['Horarios'],

                summary: 'Exclui um horario',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do horario'
                    }
                ],

                responses: {
                    204: {
                        description: 'Horario excluido com sucesso'
                    },

                    404: {
                        description: 'Horario nao encontrado'
                    },

                    409: {
                        description: 'Horario reservado ou ja utilizado em agendamento'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        }
    }
};

module.exports = horarioSwagger;
