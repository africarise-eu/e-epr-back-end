'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.removeColumn('ImportShipmentProducts', 'cdNo');
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.addColumn('ImportShipmentProducts', 'cdNo', {
            type: Sequelize.STRING,
        });
    },
};
