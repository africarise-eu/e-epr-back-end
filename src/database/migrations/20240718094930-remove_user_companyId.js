'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Users', 'companyId');
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.addColumn('Companies', 'companyId');
    },
};
