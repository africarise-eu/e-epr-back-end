const i18n = require('i18n');

module.exports = (req, res, next) => {
    const preferredLanguage = req.headers['accept-language'] ? req.headers['accept-language'] : 'en';
    i18n.setLocale(preferredLanguage);
    next();
};
