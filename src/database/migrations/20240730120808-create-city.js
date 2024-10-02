'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Cities', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING,
            },
            lat: {
                type: Sequelize.STRING,
            },
            lng: {
                type: Sequelize.STRING,
            },
            countyId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Countries',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            adminName: {
                type: Sequelize.STRING,
            },
            capital: {
                type: Sequelize.STRING,
            },
            population: {
                type: Sequelize.INTEGER,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Cities');
    },
};
