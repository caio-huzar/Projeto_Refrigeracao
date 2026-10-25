const pecaSwagger = {
    paths: {

        '/pecas': {
            get: {
                tags: ['Pecas'],
                summary: 'Lista todas as pecas',

                responses: {
                    200: {
                        description: 'Lista de pecas retornada com sucesso'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            post: {
                tags: ['Pecas'],
                summary: 'Cadastra uma nova peca',

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                properties: {
                                    nome: {
                                        type: 'string',
                                        example: 'Compressor de geladeira'
                                    },

                                    descricao: {
                                        type: 'string',
                                        example: 'Compressor para geladeira domestica'
                                    },

                                    preco_custo: {
                                        type: 'number',
                                        format: 'double',
                                        example: 350.00
                                    },

                                    preco_venda: {
                                        type: 'number',
                                        format: 'double',
                                        example: 500.00
                                    },

                                    quantidade: {
                                        type: 'integer',
                                        example: 10
                                    },

                                    fornecedor: {
                                        type: 'string',
                                        example: 'Fornecedor ABC'
                                    },

                                    codigo_barras: {
                                        type: 'integer',
                                        example: 789123456
                                    }
                                },

                                required: [
                                    'nome',
                                    'preco_venda',
                                    'quantidade'
                                ]
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: 'Peca cadastrada com sucesso'
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

        '/pecas/{id}': {

            get: {
                tags: ['Pecas'],
                summary: 'Busca uma peca pelo ID',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID da peca'
                    }
                ],

                responses: {
                    200: {
                        description: 'Peca encontrada'
                    },

                    404: {
                        description: 'Peca nao encontrada'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            put: {
                tags: ['Pecas'],
                summary: 'Altera uma peca',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID da peca'
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
                                        example: 'Compressor de geladeira'
                                    },

                                    descricao: {
                                        type: 'string',
                                        example: 'Compressor para geladeira domestica'
                                    },

                                    preco_custo: {
                                        type: 'number',
                                        format: 'double',
                                        example: 350.00
                                    },

                                    preco_venda: {
                                        type: 'number',
                                        format: 'double',
                                        example: 500.00
                                    },

                                    quantidade: {
                                        type: 'integer',
                                        example: 10
                                    },

                                    fornecedor: {
                                        type: 'string',
                                        example: 'Fornecedor ABC'
                                    },

                                    codigo_barras: {
                                        type: 'integer',
                                        example: 789123456
                                    }
                                },

                                required: [
                                    'nome',
                                    'preco_venda',
                                    'quantidade'
                                ]
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description: 'Peca alterada com sucesso'
                    },

                    404: {
                        description: 'Peca nao encontrada'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            delete: {
                tags: ['Pecas'],
                summary: 'Exclui uma peca',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID da peca'
                    }
                ],

                responses: {
                    200: {
                        description: 'Peca excluida com sucesso'
                    },

                    404: {
                        description: 'Peca nao encontrada'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        }
    }
};

module.exports = pecaSwagger;