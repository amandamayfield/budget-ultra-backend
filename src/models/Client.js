const Sequelize = require('sequelize');
const sequelize = require('./db');

module.exports = sequelize.define('client', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    secret: Sequelize.STRING,
    redirectUri: Sequelize.TEXT,
    name: Sequelize.STRING,
    grantType: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    scope: Sequelize.STRING,
}, {
    indexes: [],
});
