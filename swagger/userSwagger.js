const userSwagger = {
    paths: {

        // LISTAR USUÁRIOS
        '/usuarios': {
            get: {
                tags: ['Usuários'],
                summary: 'Lista todos os usuários',

                responses: {
                    200: {
                        description: 'Lista de usuários retornada com sucesso'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            // INSERIR USUÁRIO
            post: {
                tags: ['Usuários'],
                summary: 'Cadastra um novo usuário',

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
                        description: 'Usuário cadastrado com sucesso'
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

        // BUSCAR USUÁRIO POR ID
        '/usuarios/{id}': {

            get: {
                tags: ['Usuários'],
                summary: 'Busca um usuário pelo ID',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do usuário'
                    }
                ],

                responses: {
                    200: {
                        description: 'Usuário encontrado'
                    },

                    404: {
                        description: 'Usuário não encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            // ALTERAR USUÁRIO
            put: {
                tags: ['Usuários'],
                summary: 'Altera um usuário',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do usuário'
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
                        description: 'Usuário alterado com sucesso'
                    },

                    404: {
                        description: 'Usuário não encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            // EXCLUIR USUÁRIO
            delete: {
                tags: ['Usuários'],
                summary: 'Exclui um usuário',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do usuário'
                    }
                ],

                responses: {
                    200: {
                        description: 'Usuário excluído com sucesso'
                    },

                    404: {
                        description: 'Usuário não encontrado'
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