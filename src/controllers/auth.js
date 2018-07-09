const bcrypt = require('bcrypt');
const crypto = require('crypto');
const express = require('express');
// const base64URL = require('base64url');

const log = require('../logger');
const { User, Passport, Client, AccessToken } = require('../models');

const router = express.Router();

const generateRandomToken = () => crypto.createHash('sha1').update(crypto.randomBytes(256)).digest('hex');
// const generateRandomSecret = () => base64URL(crypto.randomBytes(48));

function validatePassword (password, hashedPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashedPassword, (error, result) => {
            if (error) {
                log.error('bcrypt error', error);
                return reject(error);
            }

            if (!result) {
                reject(new Error('invalid email/password combination'));
            }

            resolve(true);
        });
    });
}

router.post('/authorize', async (request, response, next) => {
    // Uniform delayed errors for preventing brute force password attempts
    const authenticationError = (error) => setTimeout(() => next(error), 5000);

    const { email, password } = request.body;
    const { client_id, redirect_uri } = request.query;
    let user = null;
    try {
        user = await User.findOne({ where: { email }});
        if (!user) {
            throw new Error('invalid email/password combination');
        }
    } catch (error) {
        return authenticationError(error);
    }

    const userId = user.id;
    const passportWhere = {
        protocol: 'local',
        userId,
    };
    let passport = null;
    try {
        passport = await Passport.findOne({ where: passportWhere });
        await validatePassword(password, passport.password);
    } catch (error) {
        return authenticationError(error);
    }

    // Shared code needs to be refactored out
    let client = null;
    try {
        client = await Client.findById(client_id);
        if (!client) {
            throw new Error('invalid `client_id`');
        }

        const redirectURIs = client.redirectUri.split(/\s+/);
        if (!redirectURIs.includes(redirect_uri)) {
            throw new Error('invalid `redirect_uri`');
        }
    } catch (error) {
        return authenticationError(error);
    }

    const clientId = client.id;
    const token = generateRandomToken();
    const refreshToken = generateRandomToken();
    const tokenExpiresAt = new Date();
    const refreshTokenExpiresAt = new Date();
    tokenExpiresAt.setSeconds(tokenExpiresAt.getSeconds() + 60*60*24*30); // 1 month
    refreshTokenExpiresAt.setSeconds(refreshTokenExpiresAt.getSeconds() + 60*60*24*90); // 3 months

    let accessToken = null;
    try {
        accessToken = await AccessToken.create({ userId, clientId, token, tokenExpiresAt, refreshToken, refreshTokenExpiresAt });
    } catch (error) {
        return next(error);
    }

    // if client type implicit
    response.redirect(`${redirect_uri}#accessToken=${accessToken.token}&refreshToken=${accessToken.refreshToken}`);
});

// Exchange auth code for token
router.post('/token', function () {});
// Exchange refresh token for access token (requires auth)
router.post('/token/refresh', function () {});

router.post('/local', async (request, response, next) => {
    const { email, password } = request.body;
    log.info(request.body);
    let user = null;
    try {
        user = await User.create({ email });
    } catch (error) {
        return next(error);
    }

    try {
        await Passport.create({
            protocol: 'local',
            userId: user.id,
            password,
        });
    } catch (error) {
        user.destroy();
        return next(error);
    }

    response.json(user);
});
// connect/disconnect (requires auth)
router.post('/local/:action', function () {});
// provider login/register endpoint
router.get('/:provider', function () {});
// connect/disconnect/callback
router.get('/:provider/:action', function () {});

module.exports = router;
