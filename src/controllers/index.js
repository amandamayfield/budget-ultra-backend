const express = require('express');
const router = express.Router();
const helloWorldRoutes = require('./helloWorld');

router.use('/hello-world/', helloWorldRoutes);

module.exports = router;
