require('dotenv').config();
const fs = require('fs');
const path = require('path');
const dbFilePath = path.join(process.cwd(), `${process.env.DB_TEST_NAME}.sqlite`);

const dropDb = async () => {
    try {
        await fs.unlinkSync(dbFilePath);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error deleting database: ${error.message}`);
        process.exit(1);
    }
};

module.exports = async () => {
    await dropDb();
};
