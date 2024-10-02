'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('EndDestinations', 'companyId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'Companies',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: true,
        });

        await queryInterface.addColumn('EndDestinations', 'userId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'Users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: true,
        });

        await queryInterface.addColumn('EndDestinations', 'orgType', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn('EndDestinations', 'orgName', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn('EndDestinations', 'companyRegNo', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn('EndDestinations', 'phone', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn('EndDestinations', 'email', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn('EndDestinations', 'contactPerson', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn('EndDestinations', 'address', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn('EndDestinations', 'city', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn('EndDestinations', 'country', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('EndDestinations', 'companyId');
        await queryInterface.removeColumn('EndDestinations', 'userId');
        await queryInterface.removeColumn('EndDestinations', 'orgType');
        await queryInterface.removeColumn('EndDestinations', 'orgName');
        await queryInterface.removeColumn('EndDestinations', 'companyRegNo');
        await queryInterface.removeColumn('EndDestinations', 'phone');
        await queryInterface.removeColumn('EndDestinations', 'email');
        await queryInterface.removeColumn('EndDestinations', 'contactPerson');
        await queryInterface.removeColumn('EndDestinations', 'address');
        await queryInterface.removeColumn('EndDestinations', 'city');
        await queryInterface.removeColumn('EndDestinations', 'country');
    },
};
