'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('EndDestinations', 'status', {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.addColumn('EndDestinations', 'rejectedReason', {
            type: Sequelize.TEXT,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('EndDestinations', 'status');
        await queryInterface.removeColumn('EndDestinations', 'rejectedReason');
    },
};
