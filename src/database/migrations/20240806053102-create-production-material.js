'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ProductionMaterials', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            materialId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'TaeFees',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            productionId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Productions',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            plan: {
                type: Sequelize.FLOAT,
            },
            taeStatus: {
                type: Sequelize.STRING,
            },
            actual: {
                type: Sequelize.FLOAT,
            },
            taePayStatus: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable('ProductionMaterials');
    },
};
