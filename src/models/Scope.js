const Sequelize = require('sequelize');
const sequelize = require('./db');

module.exports = sequelize.define('scope', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
    },
    name: Sequelize.STRING,
    isDefault: Sequelize.BOOLEAN,
}, {
    indexes: [],
});
