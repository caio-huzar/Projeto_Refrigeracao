const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    'refri',
    'postgres',
    'zz1973',
    {
        host: 'localhost',
        dialect: 'postgres',
        logging: false
    }
);

module.exports = sequelize;

