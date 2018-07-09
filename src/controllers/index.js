const express = require('express');

const authRoutes = require('./auth');
const log = require('../logger');
const db = require('../models/db');

const router = express.Router();

// Aggregate Controllers into subroutes
router.use('/auth/', authRoutes);

/**
 * ELB Healthcheck endpoint. Sanity check that the service is responding.
 */
router.use('/healthcheck', (req, res) => res.json({ running: true }));

/**
 * Debugging Endpoint. Gives status of service, and external connections
 */
router.use('/status', async (req, res) => {
    const node = true;
    let mysql = true;

    try {
        await db.authenticate();
    } catch (error) {
        mysql = false;
        log.error(error);
    }

    res.json({ node, mysql });
});

module.exports = router;
