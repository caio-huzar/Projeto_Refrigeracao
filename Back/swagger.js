const clienteSwagger = require('./swagger/clienteSwagger');
const osSwagger = require('./swagger/OSSwagger');
const pecaSwagger = require('./swagger/pecaSwagger');
const servicoSwagger = require('./swagger/servicoSwagger');
const tecnicoSwagger = require('./swagger/tecnicoSwagger');
const userSwagger = require('./swagger/userSwagger');
const horarioSwagger = require('./swagger/horarioSwagger');
const agendamentoSwagger = require('./swagger/agendamentoSwagger');
const orcamentoSwagger = require('./swagger/orcamentoSwagger');

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

    paths: {
        ...clienteSwagger.paths,
        ...osSwagger.paths,
        ...pecaSwagger.paths,
        ...servicoSwagger.paths,
        ...tecnicoSwagger.paths,
        ...userSwagger.paths,
        ...horarioSwagger.paths,
        ...agendamentoSwagger.paths,
        ...orcamentoSwagger.paths
    }
};

module.exports = swaggerSpec;