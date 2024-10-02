const { Sequelize } = require('sequelize');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const dbFilePath = path.join(process.cwd(), `${process.env.DB_TEST_NAME}.sqlite`);
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbFilePath,
});

async function createDatabase() {
    try {
        if (fs.existsSync(dbFilePath)) {
            await fs.unlinkSync(dbFilePath);
        }
        await sequelize.authenticate();
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error creating database:', error);
    }
}

createDatabase();
