require('dotenv').config();
const path = require('path');
const dbFilePath = path.join(process.cwd(), `${process.env.DB_TEST_NAME}.sqlite`);

module.exports = {
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        seederStorage: 'sequelize',
        dialectOptions: {
            decimalNumbers: true,
            useUTC: false, // for reading from database
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
        timezone: '+00:00', // for writing to database
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    },
    uat: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        seederStorage: 'sequelize',
        dialectOptions: {
            decimalNumbers: true,
            useUTC: false, // for reading from database
        },
        timezone: '+00:00', // for writing to database
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    },
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        seederStorage: 'sequelize',
        dialectOptions: {
            decimalNumbers: true,
            useUTC: false, // for reading from database
        },
        timezone: '+00:00', // for writing to database
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    },
    test: {
        storage: dbFilePath,
        dialect: process.env.TEST_DB_DIALECT || 'sqlite',
        seederStorage: 'sequelize',
        dialectOptions: { decimalNumbers: true },
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    },
};
