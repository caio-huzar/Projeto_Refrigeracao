const tecnicoSwagger = {
    paths: {

        // LISTAR TÉCNICOS
        '/tecnicos': {
            get: {
                tags: ['Técnicos'],
                summary: 'Lista todos os técnicos',

                responses: {
                    200: {
                        description: 'Lista de técnicos retornada com sucesso'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            // INSERIR TÉCNICO
            post: {
                tags: ['Técnicos'],
                summary: 'Cadastra um novo técnico',

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                properties: {
                                    nome: {
                                        type: 'string',
                                        example: 'João da Silva'
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
                        description: 'Técnico cadastrado com sucesso'
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

        // BUSCAR TÉCNICO POR ID
        '/tecnicos/{id}': {

            get: {
                tags: ['Técnicos'],
                summary: 'Busca um técnico pelo ID',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do técnico'
                    }
                ],

                responses: {
                    200: {
                        description: 'Técnico encontrado'
                    },

                    404: {
                        description: 'Técnico não encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            // ALTERAR TÉCNICO
            put: {
                tags: ['Técnicos'],
                summary: 'Altera um técnico',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do técnico'
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
                                        example: 'João da Silva'
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
                        description: 'Técnico alterado com sucesso'
                    },

                    404: {
                        description: 'Técnico não encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

            // EXCLUIR TÉCNICO
            delete: {
                tags: ['Técnicos'],
                summary: 'Exclui um técnico',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'integer'
                        },

                        description: 'ID do técnico'
                    }
                ],

                responses: {
                    200: {
                        description: 'Técnico excluído com sucesso'
                    },

                    404: {
                        description: 'Técnico não encontrado'
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