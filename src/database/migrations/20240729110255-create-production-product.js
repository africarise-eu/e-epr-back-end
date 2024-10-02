'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ProductionProducts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            productId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Products',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
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
                allowNull: false,
            },
            planVerification: {
                type: Sequelize.STRING,
            },
            planRejectReason: {
                type: Sequelize.TEXT,
            },
            actual: {
                type: Sequelize.FLOAT,
            },
            actualStatus: {
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
        await queryInterface.dropTable('ProductionProducts');
    },
};
