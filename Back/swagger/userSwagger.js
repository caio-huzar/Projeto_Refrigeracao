const userSwagger = {
    paths: {

        '/usuarios': {
            get: {
                tags: ['Usuarios'],
                summary: 'Lista todos os usuarios',

                responses: {
                    200: {
                        description: 'Lista de usuarios retornada com sucesso'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            post: {
                tags: ['Usuarios'],
                summary: 'Cadastra um novo usuario',

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                properties: {
                                    email: {
                                        type: 'string',
                                        format: 'email',
                                        example: 'usuario@email.com'
                                    },

                                    senha_hash: {
                                        type: 'string',
                                        example: '$2b$10$exemploHashDaSenha'
                                    },

                                    cargo: {
                                        type: 'string',
                                        enum: [
                                            'cliente',
                                            'funcionario'
                                        ],
                                        example: 'cliente'
                                    },

                                    esta_ativo: {
                                        type: 'boolean',
                                        example: true
                                    }
                                },

                                required: [
                                    'email',
                                    'senha_hash',
                                    'cargo'
                                ]
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: 'Usuario cadastrado com sucesso'
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

        '/usuarios/{id}': {

            get: {
                tags: ['Usuarios'],
                summary: 'Busca um usuario pelo ID',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do usuario'
                    }
                ],

                responses: {
                    200: {
                        description: 'Usuario encontrado'
                    },

                    404: {
                        description: 'Usuario nao encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            put: {
                tags: ['Usuarios'],
                summary: 'Altera um usuario',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do usuario'
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                properties: {
                                    email: {
                                        type: 'string',
                                        format: 'email',
                                        example: 'usuario@email.com'
                                    },

                                    senha_hash: {
                                        type: 'string',
                                        example: '$2b$10$exemploHashDaSenha'
                                    },

                                    cargo: {
                                        type: 'string',
                                        enum: [
                                            'cliente',
                                            'funcionario'
                                        ],
                                        example: 'funcionario'
                                    },

                                    esta_ativo: {
                                        type: 'boolean',
                                        example: true
                                    }
                                },

                                required: [
                                    'email',
                                    'senha_hash',
                                    'cargo'
                                ]
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description: 'Usuario alterado com sucesso'
                    },

                    404: {
                        description: 'Usuario nao encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            delete: {
                tags: ['Usuarios'],
                summary: 'Exclui um usuario',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do usuario'
                    }
                ],

                responses: {
                    200: {
                        description: 'Usuario excluido com sucesso'
                    },

                    404: {
                        description: 'Usuario nao encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        }
    }
};

module.exports = userSwagger;