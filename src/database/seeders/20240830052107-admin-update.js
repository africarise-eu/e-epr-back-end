'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkUpdate('Users', { status: 'enabled', isActive: true }, { email: 'admin@tae.com' });
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkUpdate('Users', { status: 'disabled', isActive: false }, { email: 'admin@tae.com' });
    },
};
