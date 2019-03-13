const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'nodejsguide', {
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequelize;