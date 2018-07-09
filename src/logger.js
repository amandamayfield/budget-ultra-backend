const isProduction = process.env.NODE_ENV === 'production';
const winston = require('winston');
const { format } = winston;
const { combine, timestamp, json } = format;

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    transports: new winston.transports.Console({
        timestamp: true,
        colorize: !isProduction,
        format: combine(
            timestamp(),
            json({
                space: isProduction ? null : 2,
            }),
        ),
    }),
});

module.exports = logger;
