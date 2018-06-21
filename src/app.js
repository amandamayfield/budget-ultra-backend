const express = require('express');
const controllers = require('./controllers');
const app = express();

app.use(controllers);

module.exports = app;
