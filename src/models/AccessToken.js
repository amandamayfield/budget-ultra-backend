const Sequelize = require('sequelize');
const sequelize = require('./db');

const Client = require('./Client');
const User = require('./User');

module.exports = sequelize.define('access_token', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
    },
    userId: {
        type: Sequelize.UUID,
        references: {
            model: User,
            key: 'id',
        },
    },
    clientId: {
        type: Sequelize.STRING,
        references: {
            model: Client,
            key: 'id',
        },
    },
    token: Sequelize.STRING,
    tokenExpiresAt: Sequelize.DATE(6),
    refreshToken: Sequelize.STRING,
    refreshTokenExpiresAt: Sequelize.DATE(6),
    scope: Sequelize.STRING,
}, {
    indexes: [],
});
