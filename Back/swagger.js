const authSwagger = require('./swagger/authSwagger');
const clienteSwagger = require('./swagger/clienteSwagger');
const osSwagger = require('./swagger/OSSwagger');
const pecaSwagger = require('./swagger/pecaSwagger');
const servicoSwagger = require('./swagger/servicoSwagger');
const tecnicoSwagger = require('./swagger/tecnicoSwagger');
const userSwagger = require('./swagger/userSwagger');
const horarioSwagger = require('./swagger/horarioSwagger');
const agendamentoSwagger = require('./swagger/agendamentoSwagger');
const orcamentoSwagger = require('./swagger/orcamentoSwagger');

const paths = {
    ...authSwagger.paths,
    ...clienteSwagger.paths,
    ...osSwagger.paths,
    ...pecaSwagger.paths,
    ...servicoSwagger.paths,
    ...tecnicoSwagger.paths,
    ...userSwagger.paths,
    ...horarioSwagger.paths,
    ...agendamentoSwagger.paths,
    ...orcamentoSwagger.paths
};

const protectedOperations = {
    '/usuarios': ['get', 'post'],
    '/usuarios/{id}': ['get', 'put', 'delete'],
    '/clientes': ['get', 'post'],
    '/clientes/{id}': ['get', 'put', 'delete'],
    '/os': ['get', 'post'],
    '/os/{id}': ['get'],
    '/agendamentos': ['get', 'post'],
    '/agendamentos/{id}/confirmar': ['patch'],
    '/agendamentos/{id}/cancelar': ['patch'],
    '/orcamentos': ['get', 'post'],
    '/orcamentos/{id}': ['get'],
    '/orcamentos/{id}/status': ['patch']
};

for (const [path, methods] of Object.entries(protectedOperations)) {
    for (const method of methods) {
        if (paths[path]?.[method]) paths[path][method].security = [{ bearerAuth: [] }];
    }
}

const swaggerSpec = {
    openapi: '3.0.0',

    info: {
        title: 'API - Sistema',
        version: '1.0.0',
        description: 'Documentacao da API do sistema'
    },

    servers: [
        {
            url: 'http://localhost:3000'
        }
    ],

    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    },
    paths
};

module.exports = swaggerSpec;