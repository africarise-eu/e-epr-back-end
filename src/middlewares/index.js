const validation = require('./validation');
const authenticationMechanism = require('./authentication');
const language = require('./language');

module.exports = {
    validationMiddleware: validation,
    authenticationMiddleware: authenticationMechanism,
    language: language,
};
