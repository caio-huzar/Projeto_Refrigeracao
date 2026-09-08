const { type } = require("express/lib/response");

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
                                    id_usuario:{
                                        type: 'integer',
                                        example: 1
                                    },
                                    nome: {
                                        type: 'string',
                                        example: 'Caio Huzar'
                                    },
                                    telefone:{
                                        type: 'string',
                                        example: '42999999999'
                                    },
                                    cpf_cnpj:{
                                        type: 'string',
                                        example: '11122233344'
                                    },
                                    rua:{
                                        type: 'string',
                                        example: 'Rua Sla Nao Sei'
                                    },
                                    numero_casa:{
                                        type: 'integer',
                                        example: 69
                                    },
                                    bairro:{
                                        type: 'string',
                                        example: 'Vila tal'
                                    },
                                    cep:{
                                        type: 'string',
                                        example: 83900000
                                    },
                                    cidade:{
                                        type: 'string',
                                        example: 'Uniao da Vitoria'
                                    },
                                    estado:{
                                        type: 'string',
                                        example: 'Parana'
                                    }
                                },

                                required: ['id_usuario', 'nome', 'telefone', 'cpf_cnpj', 'rua', 'numero_casa', 'bairro', 'cep', 'cidade', 'estado']
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
                                    id_usuario:{
                                        type: 'integer',
                                        example: 1
                                    },
                                    nome: {
                                        type: 'string',
                                        example: 'Caio Huzar'
                                    },
                                    telefone:{
                                        type: 'string',
                                        example: '42999999999'
                                    },
                                    cpf_cnpj:{
                                        type: 'string',
                                        example: '11122233344'
                                    },
                                    rua:{
                                        type: 'string',
                                        example: 'Rua Sla Nao Sei'
                                    },
                                    numero_casa:{
                                        type: 'integer',
                                        example: 69
                                    },
                                    bairro:{
                                        type: 'string',
                                        example: 'Vila tal'
                                    },
                                    cep:{
                                        type: 'string',
                                        example: 83900000
                                    },
                                    cidade:{
                                        type: 'string',
                                        example: 'Uniao da Vitoria'
                                    },
                                    estado:{
                                        type: 'string',
                                        example: 'Parana'
                                    }
                                },

                                required: ['id_usuario', 'nome', 'telefone', 'cpf_cnpj', 'rua', 'numero_casa', 'bairro', 'cep', 'cidade', 'estado']
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
