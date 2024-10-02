'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('ProductionProducts', 'planAmount', {
            allowNull: true,
            type: Sequelize.FLOAT,
        });
        await queryInterface.addColumn('ProductionProducts', 'actualAmount', {
            allowNull: true,
            type: Sequelize.FLOAT,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('ProductionProducts', 'planAmount');
        await queryInterface.removeColumn('ProductionProducts', 'actualAmount');
    },
};
