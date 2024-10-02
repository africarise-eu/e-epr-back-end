'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Remove old columns
        await queryInterface.removeColumn('EndDestinations', 'country');
        await queryInterface.removeColumn('EndDestinations', 'city');
        
        // Add new columns with integer type
        await queryInterface.addColumn('EndDestinations', 'countryId', {
            type: Sequelize.INTEGER,
            allowNull: true, // Adjust based on your requirements
        });
        await queryInterface.addColumn('EndDestinations', 'cityId', {
            type: Sequelize.INTEGER,
            allowNull: true, // Adjust based on your requirements
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Remove new columns
        await queryInterface.removeColumn('EndDestinations', 'countryId');
        await queryInterface.removeColumn('EndDestinations', 'cityId');
        
        // Re-add old columns with string type
        await queryInterface.addColumn('EndDestinations', 'country', {
            type: Sequelize.STRING,
            allowNull: true, // Adjust based on your requirements
        });
        await queryInterface.addColumn('EndDestinations', 'city', {
            type: Sequelize.STRING,
            allowNull: true, // Adjust based on your requirements
        });
    }
};
