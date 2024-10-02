const { format, createLogger, transports } = require('winston');
const { CONSTANTS } = require('../config');
const DailyRotateFile = require('winston-daily-rotate-file');

const { combine, timestamp, label, printf } = format;
const fileTransport = new transports.File({ filename: 'logfile.log' });

const customFormat = printf(({ level, message, label, timestamp }) => {
    let silent;
    if (process.env.NODE_ENV === 'test') {
        silent = true;
    } else {
        silent = false;
    }

    return JSON.stringify({
        level,
        timestamp,
        env: label.env,
        message,
        silent: silent,
    });
});

fileTransport.on('error', (error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to create log file:', error);
});

const logger = createLogger({
    level: 'debug',
    format: combine(
        label({ label: { env: CONSTANTS.APP.env } }),
        timestamp({
            format: 'DD-MM-YYYY HH:mm:ss',
        }),
        customFormat
    ),
    transports: [
        new transports.Console(),
        new DailyRotateFile({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '30d',
        }),
    ],
    exitOnError: false,
    silent: process.env.NODE_ENV === 'test' ? true : false,
});

module.exports = logger;
