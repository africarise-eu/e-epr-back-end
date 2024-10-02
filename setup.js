require('dotenv').config();
const { exec } = require('child_process');

const util = require('util');
const promisifiedExec = util.promisify(exec);
module.exports = async () => {
    try {
        await promisifiedExec('node ./testDb');
        await promisifiedExec('npx sequelize-cli db:migrate');
        await promisifiedExec('npx sequelize-cli db:seed:all');
    } catch (error) {
        process.exit(1);
    }
};
