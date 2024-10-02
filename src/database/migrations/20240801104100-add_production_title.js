'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Productions', 'title', {
            allowNull: true,
            type: Sequelize.STRING,
        });
        await queryInterface.addColumn('Productions', 'description', {
            allowNull: true,
            type: Sequelize.TEXT,
        });
        await queryInterface.addColumn('Productions', 'status', {
            type: Sequelize.STRING,
            defaultValue: 'pending',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('ProductionProducts', 'title');
        await queryInterface.removeColumn('ProductionProducts', 'description');
    },
};
