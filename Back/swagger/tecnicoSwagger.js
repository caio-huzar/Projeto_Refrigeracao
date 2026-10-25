const tecnicoSwagger = {
    paths: {

        '/tecnicos': {
            get: {
                tags: ['Tecnicos'],
                summary: 'Lista todos os tecnicos',

                responses: {
                    200: {
                        description: 'Lista de tecnicos retornada com sucesso'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            post: {
                tags: ['Tecnicos'],
                summary: 'Cadastra um novo tecnico',

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                properties: {
                                    nome: {
                                        type: 'string',
                                        example: 'Joao da Silva'
                                    },

                                    telefone: {
                                        type: 'string',
                                        example: '42999999999'
                                    },

                                    esta_ativo: {
                                        type: 'boolean',
                                        example: true
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: 'Tecnico cadastrado com sucesso'
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

        '/tecnicos/{id}': {

            get: {
                tags: ['Tecnicos'],
                summary: 'Busca um tecnico pelo ID',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do tecnico'
                    }
                ],

                responses: {
                    200: {
                        description: 'Tecnico encontrado'
                    },

                    404: {
                        description: 'Tecnico nao encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            put: {
                tags: ['Tecnicos'],
                summary: 'Altera um tecnico',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do tecnico'
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
                                        example: 'Joao da Silva'
                                    },

                                    telefone: {
                                        type: 'string',
                                        example: '42999999999'
                                    },

                                    esta_ativo: {
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
                        description: 'Tecnico alterado com sucesso'
                    },

                    404: {
                        description: 'Tecnico nao encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            delete: {
                tags: ['Tecnicos'],
                summary: 'Exclui um tecnico',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do tecnico'
                    }
                ],

                responses: {
                    200: {
                        description: 'Tecnico excluido com sucesso'
                    },

                    404: {
                        description: 'Tecnico nao encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        }
    }
};

module.exports = tecnicoSwagger;