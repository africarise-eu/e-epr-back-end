'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Companies', 'city');
        await queryInterface.removeColumn('Companies', 'country');
        await queryInterface.addColumn('Companies', 'country', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Countries',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        });
        await queryInterface.addColumn('Companies', 'city', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'Cities',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Companies', 'city');
        await queryInterface.removeColumn('Companies', 'country');
        await queryInterface.addColumn('Companies', 'country', {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.addColumn('Companies', 'city', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },
};
