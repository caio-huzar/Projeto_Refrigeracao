const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    'refri',
    'postgres',
    'zz1973',
    {
        host: '100.76.20.87',
        dialect: 'postgres',
        logging: false
    }
);

module.exports = sequelize;

