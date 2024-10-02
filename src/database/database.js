const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

async function createDatabase() {
    try {
        await sequelize.authenticate();

        console.log("process.env.DB_HOST", process.env.DB_HOST);
        console.log("process.env.DB_PORT", process.env.DB_PORT);
        console.log("process.env.DB_USERNAME", process.env.DB_USERNAME);
        console.log("process.env.DB_PASSWORD", process.env.DB_PASSWORD)
       
        // Connect to the default 'postgres' database to create a new database
        const defaultDb = new Sequelize({
            dialect: process.env.DB_DIALECT,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        await defaultDb.query(`CREATE DATABASE ${process.env.DB_NAME}`);
        await defaultDb.close();

        console.log(`Database ${process.env.DB_NAME} created successfully`);
    } catch (error) {
        console.error('Error creating database:', error);
    } finally {
        await sequelize.close();
    }
}

createDatabase();