'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn('ImportShipmentProducts', 'cdNo', {
            type: Sequelize.STRING,
            allowNull: false,
        });
        await queryInterface.addColumn('ImportShipmentProducts', 'shipmentId', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'ImportShipments',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn('ImportShipmentProducts', 'cdNo', {
            type: Sequelize.INTEGER,
            allowNull: false,
        });
        await queryInterface.removeColumn('ImportShipmentProducts', 'shipmentId');
    },
};
