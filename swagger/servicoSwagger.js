const servicoSwagger = {
    paths: {

        // LISTAR SERVIÇOS
        '/servicos': {
            get: {
                tags: ['Serviços'],
                summary: 'Lista todos os serviços',

                responses: {
                    200: {
                        description: 'Lista de serviços retornada com sucesso'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            // INSERIR SERVIÇO
            post: {
                tags: ['Serviços'],
                summary: 'Cadastra um novo serviço',

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                properties: {
                                    nome: {
                                        type: 'string',
                                        example: 'Manutenção de geladeira'
                                    },

                                    descricao: {
                                        type: 'string',
                                        example: 'Manutenção completa do sistema de refrigeração'
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
                        description: 'Serviço cadastrado com sucesso'
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

        // BUSCAR SERVIÇO POR ID
        '/servicos/{id}': {

            get: {
                tags: ['Serviços'],
                summary: 'Busca um serviço pelo ID',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do serviço'
                    }
                ],

                responses: {
                    200: {
                        description: 'Serviço encontrado'
                    },

                    404: {
                        description: 'Serviço não encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            // ALTERAR SERVIÇO
            put: {
                tags: ['Serviços'],
                summary: 'Altera um serviço',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do serviço'
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
                                        example: 'Manutenção de geladeira'
                                    },

                                    descricao: {
                                        type: 'string',
                                        example: 'Manutenção completa do sistema de refrigeração'
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
                        description: 'Serviço alterado com sucesso'
                    },

                    404: {
                        description: 'Serviço não encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            // EXCLUIR SERVIÇO
            delete: {
                tags: ['Serviços'],
                summary: 'Exclui um serviço',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do serviço'
                    }
                ],

                responses: {
                    200: {
                        description: 'Serviço excluído com sucesso'
                    },

                    404: {
                        description: 'Serviço não encontrado'
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