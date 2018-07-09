const Sequelize = require('sequelize');

/**
 * Override console.log logger with internal, configrable one
 * @type {Function}
 */
const logging = require('../logger').debug;

/**
 * Configuration for Sequelize operatorsAliases
 * Disabled due to future deprecation
 * @type {Boolean}
 */
const operatorsAliases = false;

const host = process.env.DB_HOST || '127.0.0.1';
const username = process.env.DB_USERNAME || 'root';
const password = process.env.DB_PASSWORD || '';

const database = 'budget-ultra';
const dialect = 'mysql';

const sequelizeOptions = { host, username, password, database, dialect, logging, operatorsAliases };

module.exports = new Sequelize(sequelizeOptions);
