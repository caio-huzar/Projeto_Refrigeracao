const cargoSwagger = require('./swagger/clienteSwagger');

const swaggerSpec = {
    openapi: '3.0.0',

    info: {
        title: 'API - Sistema',
        version: '1.0.0',
        description: 'Documentação da API do sistema'
    },

    servers: [
        {
            url: 'http://localhost:3000'
        }
    ],

    paths: {
        ...cargoSwagger.paths
    }
};

module.exports = swaggerSpec;