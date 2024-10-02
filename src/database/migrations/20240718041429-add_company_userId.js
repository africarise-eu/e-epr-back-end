'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Companies', 'userId', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
        await queryInterface.addColumn('Companies', 'deletedAt', {
            allowNull: true,
            type: Sequelize.DATE,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Companies', 'userId');
        await queryInterface.removeColumn('Companies', 'deletedAt');
    },
};
