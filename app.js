require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { logger } = require('./src/utils');
const routes = require('./src/routes');
const morgan = require('morgan');
const swaggerUI = require('swagger-ui-express');
const { swaggerSpec } = require('./swagger');
const i18n = require('i18n');
const { language } = require('./src/middlewares');
const fileUpload = require('express-fileupload');

const { errorHandler } = require('./src/helpers');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

i18n.configure({
    locales: ['en', 'uk'],
    directory: __dirname + '/src/config/locales',
    defaultLocale: 'en',
    fallbacks: { en_US: 'en' },
    objectNotation: true,
});

app.use(cors());
app.use(
    express.urlencoded({
        limit: '50mb',
        extended: true,
        parameterLimit: 1000000,
    })
);
app.use(express.json({ limit: '50mb' }));
app.use(fileUpload());

app.use(morgan('[:date[web]] :method :url :status :response-time ms - :res[content-length]'));
app.use(i18n.init);
app.use(language);

app.use('/api/v1', routes);
app.use('/v1/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(errorHandler);

// eslint-disable-next-line no-undef
process.on('uncaughtException', function (err) {
    logger.error(err);
});

// eslint-disable-next-line no-undef
process.on('unhandledRejection', function (reason) {
    logger.error(reason);
});

module.exports = app;
