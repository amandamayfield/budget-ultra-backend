const crypto = require('crypto');
const Sequelize = require('sequelize');
const sequelize = require('./db');

module.exports = sequelize.define('user', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
    },
    email: {
        type: Sequelize.STRING,
        validate: {
            isEmail: true,
        },
    },
    isSuperUser: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
}, {
    indexes: [
        {
            unique: true,
            fields: ['email']
        },
    ],
    getterMethods: {
        gravatarUrl: function () {
            const md5 = crypto.createHash('md5');
            md5.update(this.email || '');

            return `https://gravatar.com/avatar/${md5.digest('hex')}`;
        },
    },
});
