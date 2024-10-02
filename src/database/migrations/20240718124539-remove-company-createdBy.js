'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Companies', 'createdBy');
        await queryInterface.removeColumn('Companies', 'updatedBy');
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.addColumn('Companies', 'createdBy');
        await queryInterface.addColumn('Companies', 'updatedBy');
    },
};
