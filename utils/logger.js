const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

// Format date to YYYYMMDD
const datePattern = 'YYYYMMDD';

const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: 'logs/log-%DATE%.log',
    datePattern: datePattern,
    zippedArchive: false,
    maxSize: '20m',
    maxFiles: '14d', // keep logs for 14 days
    format: format.combine(
        format.timestamp(),
        format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
    )
});

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
    ),
    defaultMeta: { service: 'car-api' },
    transports: [
        new transports.Console(),
        dailyRotateFileTransport
    ]
});

module.exports = logger;
