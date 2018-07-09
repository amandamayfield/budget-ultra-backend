const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression')
const helmet = require('helmet');
const expressWinston = require('@chrisalderson/express-winston');

const controllers = require('./controllers');
const winstonInstance = require('./logger');
const app = express();

app.use(expressWinston.logger({ winstonInstance }));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression());
app.use(controllers);
app.use(expressWinston.errorLogger({ winstonInstance }))

module.exports = app;
