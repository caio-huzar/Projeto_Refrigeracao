const clienteSwagger = {
    paths: {

        // LISTAR CLIENTES
        '/clientes': {
            get: {
                tags: ['Clientes'],
                summary: 'Lista todos os clientes',

                responses: {
                    200: {
                        description: 'Lista de clientes retornada com sucesso'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            // INSERIR CLIENTES
            post: {
                tags: ['Clientes'],
                summary: 'Cadastra um novo cliente',

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                properties: {
                                    car_nome: {
                                        type: 'string',
                                        example: 'Desenvolvedor'
                                    }
                                },

                                required: ['cliente_nome']
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: 'cliente cadastrado com sucesso'
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

        // BUSCAR CLIENTES POR ID
        '/clientes/{id}': {

            get: {
                tags: ['Clientes'],
                summary: 'Busca um cliente pelo ID',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do cliente'
                    }
                ],

                responses: {
                    200: {
                        description: 'Cliente encontrado'
                    },

                    404: {
                        description: 'Cliente não encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            // ALTERAR CLIENTE
            put: {
                tags: ['Clientes'],
                summary: 'Altera um Cliente',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do cliente'
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                properties: {
                                    car_nome: {
                                        type: 'string',
                                        example: 'Desenvolvedor Backend'
                                    }
                                },

                                required: ['cliente_nome']
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description: 'Cliente alterado com sucesso'
                    },

                    404: {
                        description: 'Cliente não encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            // EXCLUIR CLIENTE
            delete: {
                tags: ['Clientes'],
                summary: 'Exclui um cliente',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do cliente'
                    }
                ],

                responses: {
                    200: {
                        description: 'Cliente excluído com sucesso'
                    },

                    404: {
                        description: 'Cliente não encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        }
    }
};

module.exports = clienteSwagger;
