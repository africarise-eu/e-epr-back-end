'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Companies', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            companyName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            person: {
                type: Sequelize.STRING,
            },
            imagePath: {
                type: Sequelize.STRING,
            },
            isProducer: {
                type: Sequelize.BOOLEAN,
            },
            isImporter: {
                type: Sequelize.BOOLEAN,
            },
            registrationNumber: {
                type: Sequelize.STRING,
            },
            activityCode: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.STRING,
            },
            city: {
                type: Sequelize.STRING,
            },
            phoneNumber: {
                type: Sequelize.STRING,
            },
            website: {
                type: Sequelize.STRING,
            },
            bankAccount: {
                type: Sequelize.STRING,
            },
            status: {
                type: Sequelize.STRING,
            },
            country: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            createdBy: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedBy: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Companies');
    },
};
