const constants = require('./constants');
const database = require('./database');
const httpCodes = require('./httpCodes');
const messages = require('./messages');
const enums = require('./enum');

module.exports = {
    CONSTANTS: constants,
    DATABASE: database,
    HTTP_CODES: httpCodes,
    MESSAGES: messages,
    ENUM: enums,
};
