const { type } = require("express/lib/response");

const clienteSwagger = {
    paths: {

        '/clientes/cadastro': {
            post: {
                tags: ['Clientes'],
                summary: 'Cria o login e os dados do cliente em uma operacao',
                description: 'A senha e armazenada como hash. Se a criacao do cliente falhar, o usuario tambem nao sera salvo.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['usuario', 'cliente'],
                                properties: {
                                    usuario: {
                                        type: 'object',
                                        required: ['email', 'senha'],
                                        properties: {
                                            email: { type: 'string', format: 'email', example: 'cliente@email.com' },
                                            senha: { type: 'string', format: 'password', minLength: 8, example: 'SenhaSegura123' }
                                        }
                                    },
                                    cliente: {
                                        type: 'object',
                                        required: ['nome', 'telefone', 'cpf_cnpj', 'rua', 'numero_casa', 'bairro', 'cep', 'cidade', 'estado'],
                                        properties: {
                                            nome: { type: 'string', example: 'Maria da Silva' },
                                            telefone: { type: 'string', example: '42999999999' },
                                            cpf_cnpj: { type: 'string', example: '12345678901' },
                                            rua: { type: 'string', example: 'Rua das Flores' },
                                            numero_casa: { type: 'integer', example: 123 },
                                            bairro: { type: 'string', example: 'Centro' },
                                            cep: { type: 'string', example: '84600000' },
                                            cidade: { type: 'string', example: 'Uniao da Vitoria' },
                                            estado: { type: 'string', example: 'Parana' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: 'Login e cadastro de cliente criados; a senha nao e retornada' },
                    400: { description: 'Dados ausentes ou invalidos' },
                    409: { description: 'Email, telefone ou CPF/CNPJ ja cadastrado' },
                    500: { description: 'Erro interno do servidor' }
                }
            }
        },

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
                        description: 'Dados invalidos'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        },

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
                        description: 'Cliente nao encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

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
                        description: 'Cliente nao encontrado'
                    },

                    500: {
                        description: 'Erro interno do servidor'
                    }
                }
            },

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
                        description: 'Cliente excluido com sucesso'
                    },

                    404: {
                        description: 'Cliente nao encontrado'
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
