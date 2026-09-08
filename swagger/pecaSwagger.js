const pecaSwagger = {
    paths: {

        // LISTAR PEÇAS
        '/pecas': {
            get: {
                tags: ['Peças'],
                summary: 'Lista todas as peças',

                responses: {
                    200: {
                        description: 'Lista de peças retornada com sucesso'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            // INSERIR PEÇA
            post: {
                tags: ['Peças'],
                summary: 'Cadastra uma nova peça',

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
                                        example: 'Compressor para geladeira doméstica'
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
                        description: 'Peça cadastrada com sucesso'
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

        // BUSCAR PEÇA POR ID
        '/pecas/{id}': {

            get: {
                tags: ['Peças'],
                summary: 'Busca uma peça pelo ID',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID da peça'
                    }
                ],

                responses: {
                    200: {
                        description: 'Peça encontrada'
                    },

                    404: {
                        description: 'Peça não encontrada'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            // ALTERAR PEÇA
            put: {
                tags: ['Peças'],
                summary: 'Altera uma peça',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID da peça'
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
                                        example: 'Compressor para geladeira doméstica'
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
                        description: 'Peça alterada com sucesso'
                    },

                    404: {
                        description: 'Peça não encontrada'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            // EXCLUIR PEÇA
            delete: {
                tags: ['Peças'],
                summary: 'Exclui uma peça',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID da peça'
                    }
                ],

                responses: {
                    200: {
                        description: 'Peça excluída com sucesso'
                    },

                    404: {
                        description: 'Peça não encontrada'
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