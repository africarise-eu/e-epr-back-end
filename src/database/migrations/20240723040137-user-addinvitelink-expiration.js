'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Users', 'inviteLinkExpiration', {
            type: Sequelize.DATE,
            allowNull: true,
        });
        await queryInterface.changeColumn('Users', 'password', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Users', 'inviteLinkExpiration');
        await queryInterface.changeColumn('Users', 'password', {
            allowNull: false,
        });
    },
};
