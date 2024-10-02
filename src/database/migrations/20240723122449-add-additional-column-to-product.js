'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Products', 'status', {
            allowNull: true,
            type: Sequelize.STRING,
        });

        await queryInterface.addColumn('Products', 'userId', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Products', 'status');
        await queryInterface.removeColumn('Products', 'userId');
    },
};
