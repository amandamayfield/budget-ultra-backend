const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');

const sequelize = require('./db');
const User = require('./User');

const hashPassword = (password) => new Promise((resolve, reject) => {
    bcrypt.hash(password, 12, (hashError, hash) => {
        if (hashError) {
            return reject(hashError);
        }

        return resolve({ password: hash });
    });
});

module.exports = sequelize.define('passport', {
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
    // Required field: Protocol
    //
    // Defines the protocol to use for the passport. When employing the local
    // strategy, the protocol will be set to 'local'. When using a third-party
    // strategy, the protocol will be set to the standard used by the third-
    // party service (e.g. 'oauth', 'oauth2', 'openid').
    protocol: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            is: /^[a-z0-9]+$/i,
        },
    },

    // Local field: Password
    //
    // When the local strategy is employed, a password will be used as the
    // means of authentication along with either a username or an email.
    password: {
        type: Sequelize.STRING,
        valiate: {
            len: [8],
        },
    },
    // accessToken is used to authenticate API requests. it is generated when a
    // passport (with protocol 'local') is created for a user.
    accessToken: Sequelize.STRING,

    // Provider fields: Provider, identifer and tokens
    //
    // "provider" is the name of the third-party auth service in all lowercase
    // (e.g. 'github', 'facebook') whereas "identifier" is a provider-specific
    // key, typically an ID. These two fields are used as the main means of
    // identifying a passport and tying it to a local user.
    //
    // The "tokens" field is a JSON object used in the case of the OAuth stan-
    // dards. When using OAuth 1.0, a `token` as well as a `tokenSecret` will
    // be issued by the provider. In the case of OAuth 2.0, an `accessToken`
    // and a `refreshToken` will be issued.
    provider: {
        type: Sequelize.STRING,
        validate: {
            is: /^[a-z0-9-]+$/i
        },
    },
    identifier: Sequelize.STRING,
    tokens: Sequelize.JSON,
}, {
    indexes: [],
    hooks: {
        beforeCreate: async (passport, options) => {
            const { password } = await hashPassword(passport.password);
            passport.password = password;
        },
        beforeUpdate: async (passport, options) => {
            const { password } = await hashPassword(passport.password);
            passport.password = password;
        },
    },
});
