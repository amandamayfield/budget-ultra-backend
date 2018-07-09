require('dotenv').config();
const User = require('./User');
const Passport = require('./Passport');
const Scope = require('./Scope');
const Client = require('./Client');
const AccessToken = require('./AccessToken');

const syncOptions = {
    force: Boolean(process.env.DB_FORCE),
    alter: Boolean(process.env.DB_ALTER),
};

// Ordered based on foreign key constraints
const models = [User, Passport, Scope, Client, AccessToken];
(async () => {
    await Promise.all(models.map((Model) => Model.sync(syncOptions)));
    process.exit(0);
})();
