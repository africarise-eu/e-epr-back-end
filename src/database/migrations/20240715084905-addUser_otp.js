'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Users', 'otp', {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
        await queryInterface.addColumn('Users', 'otpExpiration', {
            type: Sequelize.DATE,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Users', 'otp');
        await queryInterface.removeColumn('Users', 'otpExpiration');
    },
};
